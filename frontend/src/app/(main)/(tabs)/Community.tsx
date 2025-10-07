import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import React from "react";
import CustomSafeArea from "@/src/components/CustomSafeArea";
import { useSelector } from "react-redux";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Community = () => {
  const localIssue = useSelector((state) => state.issues.localIssues);

  const openLocationInGoogleMaps = (coords, title) => {
    const { latitude, longitude } = coords;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open Google Maps:", err)
    );
  };

  const renderPost = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{item.time || ""}</Text>
      </View>
      <Text style={styles.content}>{item.description || item.content || ""}</Text>

      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      )}

      <View style={styles.footer}>
        {/* Comment Icon */}
        <TouchableOpacity style={styles.iconRow}>
          <MaterialIcons name="comment" size={24} color="black" />
          <Text style={styles.iconText}>{item.comments?.length || 0}</Text>
        </TouchableOpacity>

        {/* Vote Icon */}
        <TouchableOpacity style={styles.iconRow}>
          <MaterialIcons name="thumb-up" size={24} color="black" />
          <Text style={styles.iconText}>{item.voteCount || 0}</Text>
        </TouchableOpacity>

        {/* Location Icon */}
        {item.location?.coordinates && (
          <TouchableOpacity
            style={styles.iconRow}
            onPress={() =>
              openLocationInGoogleMaps(
                { latitude: item.location.coordinates[1], longitude: item.location.coordinates[0] },
                item.title
              )
            }
          >
            <FontAwesome name="map-marker" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <CustomSafeArea edges={["left", "right"]}>
      <View style={styles.main}>
        <Text style={styles.headerTitle}>Community Feed</Text>
        <FlatList
          data={localIssue}
          keyExtractor={(item, index) => item._id?.toString() || index.toString()}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80, gap: 10 }}
        />
      </View>
    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1c1c1e",
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "#777",
    marginLeft: 10,
  },
  content: {
    fontSize: 15,
    marginVertical: 6,
    color: "#333",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
    resizeMode: "cover",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    gap: 20,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  iconText: {
    fontSize: 14,
    color: "#555",
  },
});

export default Community;
