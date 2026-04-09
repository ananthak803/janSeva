//@ts-nocheck
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import CustomSafeArea from "@/src/components/CustomSafeArea";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import IssueCard from "@/src/components/IssueCard";
import IssueCard2 from "@/src/components/IssueCard2";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { setLocalIssues, setUserIssues, setUser } from "@/src/redux/store";
import LoadingScreen from "@/src/components/LoadingScreen";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const localFeedRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const localIssue = useSelector((state) => state.issues.localIssues);
  const userIssue = useSelector((state) => state.issues.userIssues);
  const user = useSelector((state) => state.user.user);

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const API = process.env.EXPO_PUBLIC_BACKEND_API;

  // Auto-sliding logic for Local Service Feed
  useEffect(() => {
    if (localIssue && localIssue.length > 0) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % Math.min(localIssue.length, 5);
        setCurrentIndex(nextIndex);
        localFeedRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, 3500); // Slide every 3.5 seconds

      return () => clearInterval(interval);
    }
  }, [currentIndex, localIssue]);

  const fetchUserData = async () => {
    if (!API) return;
    const token = await SecureStore.getItemAsync("access_token");
    if (!token) return;

    try {
      const res = await axios.get(`${API}/api/resident/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setUser(res.data));
    } catch (err) {
      console.log("Error fetching user data:", err);
    }
  };

  const sendLocationToBackend = async (loc) => {
    if (!API) return;

    const token = await SecureStore.getItemAsync("access_token");
    if (!token) return;

    await axios.put(
      `${API}/api/resident/updateLocation`,
      {
        location: {
          type: "Point",
          coordinates: [loc.longitude, loc.latitude],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

  const fetchIssues = async () => {
    if (!API) return;

    const token = await SecureStore.getItemAsync("access_token");
    if (!token) return;

    const localIssueRes = await axios.get(
      `${API}/api/issue/getIssue`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(setLocalIssues(localIssueRes.data));

    const userIssueRes = await axios.get(
      `${API}/api/issue/getUserIssue`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(setUserIssues(userIssueRes.data));
  };

  const handleLocateMe = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const handleIssuePress = (issue: any) => {
    router.push(`/IssueDetail/${issue._id}`);
  };

  useEffect(() => {
    (async () => {
      try {
        if (!API) {
          console.log("API missing");
          return;
        }
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location denied");
          return;
        }
        const currentLocation =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        const loc = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        setLocation(loc);
        await sendLocationToBackend(loc);
        await fetchUserData();
        await fetchIssues();
      } catch (err) {
        console.log("Home crash error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <CustomSafeArea>
      <View style={styles.main}>
        {!isMapExpanded && (
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>Welcome {user?.email || "User"}</Text>
              </View>
              <View style={styles.headerIconContainer}>
                <FontAwesome5 name="hands-helping" size={24} color="#0c92cb" />
              </View>
            </View>
          </View>
        )}

        <View style={[styles.mapSection, isMapExpanded && styles.mapSectionExpanded]}>
          {location ? (
            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
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
              <View style={styles.mapControls}>
                <TouchableOpacity 
                  style={styles.mapControlBtn} 
                  onPress={handleLocateMe}
                >
                  <MaterialIcons name="my-location" size={20} color="#0c92cb" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.mapControlBtn} 
                  onPress={() => setIsMapExpanded(!isMapExpanded)}
                >
                  <MaterialIcons 
                    name={isMapExpanded ? "fullscreen-exit" : "fullscreen"} 
                    size={24} 
                    color="#0c92cb" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.loadingBox}>
              <Text style={styles.loadingText}>
                Location not available
              </Text>
            </View>
          )}
        </View>

        {!isMapExpanded && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.mainSection}>
              <TouchableOpacity
                style={styles.newIssueBtn}
                onPress={() => router.push("/Report")}
              >
                <MaterialIcons name="add" size={24} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.newIssueText}>
                  New Service Request
                </Text>
              </TouchableOpacity>

              <View style={styles.section1}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Local Service Feed</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  ref={localFeedRef}
                  data={localIssue.slice(0, 5)} // Top 5 issues
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={Dimensions.get("window").width - 30}
                  decelerationRate="fast"
                  renderItem={({ item }) => (
                    <IssueCard issueData={item} onPress={() => handleIssuePress(item)} />
                  )}
                  keyExtractor={(item) => item._id}
                  onMomentumScrollEnd={(event) => {
                    const index = Math.round(
                      event.nativeEvent.contentOffset.x / (Dimensions.get("window").width - 30)
                    );
                    setCurrentIndex(index);
                  }}
                />
              </View>

              <View style={styles.section2}>
                <Text style={styles.sectionTitle}>Your Submissions</Text>
                {userIssue && userIssue.length > 0 ? (
                  userIssue.map((item) => (
                    <IssueCard2 
                      key={item._id} 
                      issueData={item} 
                      onPress={() => handleIssuePress(item)} 
                    />
                  ))
                ) : (
                  <Text style={styles.emptyText}>No submissions found</Text>
                )}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: "#eff2f5" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#eff2f5",
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  mapSection: {
    height: 220,
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#eff2f5",
  },
  mapSectionExpanded: {
    height: "100%",
    paddingHorizontal: 0,
    paddingVertical: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  mapControls: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    gap: 10,
  },
  mapControlBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  loadingText: { fontSize: 14, color: "#999", fontWeight: '500' },
  map: { flex: 1, width: "100%" },
  mainSection: {
    flex: 1,
    width: "100%",
    paddingTop: 25,
    backgroundColor: "#eff2f5",
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  newIssueBtn: {
    backgroundColor: "#134e5e", // Dark teal from image
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 2,
  },
  newIssueText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    color: '#1a365d', // Dark blue from image
    fontWeight: '700',
    fontSize: 14,
  },
  section1: { width: "100%", marginBottom: 30 },
  section2: { flex: 1, width: "100%" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  listContainer: {
    paddingRight: 20,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Home;
