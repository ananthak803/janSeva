//@ts-nocheck
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import CustomSafeArea from "@/src/components/CustomSafeArea";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import IssueCard from "@/src/components/IssueCard";
import IssueCard2 from "@/src/components/IssueCard2";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { setLocalIssues, setUserIssues } from "@/src/redux/store";
import LoadingScreen from "@/src/components/LoadingScreen";
const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const localIssue = useSelector((state) => state.issues.localIssues);
  const userIssue = useSelector((state) => state.issues.userIssues);
  const [loading,setLoading]=useState(true);
  const [location, setLocation] = useState(null);

  const sendLocationToBackend = async (location) => {
    const token = await SecureStore.getItemAsync("access_token");
    if (!token) return;

    const residentLocationPayload = {
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
    };

    await axios.put(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/api/resident/updateLocation`,
      residentLocationPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

  const fetchIssues = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) return;

      const localIssueRes = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_API}/api/issue/getIssue`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setLocalIssues(localIssueRes.data));

      const userIssueRes = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_API}/api/issue/getUserIssue`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setUserIssues(userIssueRes.data));
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        const loc = {
          longitude: currentLocation.coords.longitude,
          latitude: currentLocation.coords.latitude,
        };
        setLocation(loc);

        await sendLocationToBackend(loc);
        await fetchIssues();
        setLoading(false)
      } catch (error) {
        console.error("Error getting location or fetching issues:", error);
      }
    })();
  },[]);

  if(loading){
    return <LoadingScreen/>
  }

  return (
    <CustomSafeArea edge={["left", "right"]}>
      <View style={styles.main}>
        {/* Map Section */}
        <View style={styles.mapSection}>
          {!location ? (
            <View style={styles.loadingBox}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={location} title="You are here" />
            </MapView>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainSection}>
          <TouchableOpacity
            style={styles.newIssueBtn}
            onPress={() => router.push("/Report")}
          >
            <Text style={styles.newIssueText}>+ Submit a New Issue</Text>
          </TouchableOpacity>

          <View style={styles.section1}>
            <Text style={styles.sectionTitle}>Top 5 Issues</Text>
            <FlatList
              data={localIssue}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 ,padding:10}}
              renderItem={({ item }) => <IssueCard issueData={item} />}
            />
          </View>

          <View style={styles.section2}>
            <Text style={styles.sectionTitle}>My Issues</Text>
            <View style={{alignItems:"center"}}>
                <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              data={userIssue}
              renderItem={({ item }) => <IssueCard2 issueData={item} />}
            />
            </View>
            
          </View>
        </View>
      </View>
    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: "#f6f9fc" },
  mapSection: { height: "35%", width: "100%", justifyContent: "center", alignItems: "center", zIndex: 1 },
  loadingBox: { alignItems: "center", justifyContent: "center", height: "100%" },
  loadingText: { fontSize: 18, fontWeight: "600", color: "#555" },
  map: { flex: 1, width: "100%" },
  mainSection: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -30,
    zIndex: 2,
    paddingTop: 20,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  newIssueBtn: {
    backgroundColor: "#0c92cbff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginBottom: 15,
  },
  newIssueText: { fontSize: 18, fontWeight: "600", color: "#fff" },
  section1: { width: "100%", marginBottom: 15 ,},
  section2: { flex: 1, width: "100%" },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1a1a1a", paddingBottom: 8, paddingLeft: 5 },
  listContainer: { gap: 10, paddingBottom: 45,paddingHorizontal:5,width:'90%'},
});

export default Home;
