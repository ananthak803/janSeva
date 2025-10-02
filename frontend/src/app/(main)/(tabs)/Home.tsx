// @ts-nocheck
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

import { useRouter } from "expo-router";

const home = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [location, setLocation] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.log("Permission to access location was denied");
  //       return;
  //     }

  //     let currentLocation = await Location.getCurrentPositionAsync({});
  //     setLocation({
  //       latitude: currentLocation.coords.latitude,
  //       longitude: currentLocation.coords.longitude,
  //     });
  //   })();
  // }, []);

  const tempData = [
    {
      title: "pothole in main street",
      description:
        "If you have already registered a project for another Google service on Android, such as Google Sign In, you enable the Maps SDK for Android on your project and jump to step 4",
      date: "30-09-2025",
      time: "9:40",
      vote: 10,
    },
    {
      title: "pothole in main street",
      description:
        "If you have already registered a project for another Google service on Android, such as Google Sign In, you enable the Maps SDK for Android on your project and jump to step 4",
      date: "30-09-2025",
      time: "9:40",
      vote: 10,
    },
    {
      title: "pothole in main street",
      description:
        "If you have already registered a project for another Google service on Android, such as Google Sign In, you enable the Maps SDK for Android on your project and jump to step 4",
      date: "30-09-2025",
      time: "9:40",
      vote: 10,
    },
    {
      title: "pothole in main street",
      description:
        "If you have already registered a project for another Google service on Android, such as Google Sign In, you enable the Maps SDK for Android on your project and jump to step 4",
      date: "30-09-2025",
      time: "9:40",
      vote: 10,
    },
    {
      title: "pothole in main street",
      description:
        "If you have already registered a project for another Google service on Android, such as Google Sign In, you enable the Maps SDK for Android on your project and jump to step 4",
      date: "30-09-2025",
      time: "9:40",
      vote: 10,
    },
  ];
  return (
    <CustomSafeArea edge={["left", "right"]}>
      <View style={styles.main}>
        <View style={styles.mapSection}>
          {!location ? (
            <View>
              <Text style={{ fontSize: 20, fontWeight: 600 }}>
                Loading......
              </Text>
            </View>
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker coordinate={location} title="You are here" />
            </MapView>
          )}
        </View>
        <View style={styles.mainSection}>
          <TouchableOpacity
            style={styles.newIssueBtn}
            onPress={() => {
              router.push("/Report");
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 500 }}>
              Submit a new Issue
            </Text>
          </TouchableOpacity>
          <View style={styles.section1}>
            <Text style={{ fontSize: 20, fontWeight: 800,paddingBottom:5, }}>Top 5 Issues</Text>
            <FlatList
              data={tempData}
              contentContainerStyle={{
                gap: 10,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <IssueCard
                  title={item.title}
                  date={item.date}
                  vote={item.vote}
                />
              )}
            />
          </View>
          <View style={styles.section2}>
              <Text style={{fontSize: 20, fontWeight: 800}}>My Issues</Text>
              <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                gap: 5,
                alignItems:'center'
              }}
                data={tempData}
                renderItem={({item})=>(
                  <IssueCard2 title={item.title} desc={item.description} date={item.date}/>
  )}
              />
          </View>
        </View>
      </View>
    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  mapSection: {
    height: "35%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
  },
  mainSection: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -32,
    zIndex: 2,
    paddingTop: 20,
    backgroundColor: "#ffffffff",
    elevation: 3,
    alignItems: "center",
    padding: 5,
  },
  section1: {
    height: "25%",
    width: "100%",
    // backgroundColor:'red',
    paddingHorizontal: 10,
    paddingVertical:5,
  },
  newIssueBtn: {
    backgroundColor: "#0c92cbff",
    paddingVertical:10,
    paddingHorizontal:20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  section2:{
    flex:1,
  }
});

export default home;
