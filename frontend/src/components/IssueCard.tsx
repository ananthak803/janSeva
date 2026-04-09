import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const IssueCard = ({ issueData, onPress }: any) => {
  // Simple time ago logic
  const getTimeAgo = (createdAt: string) => {
    if (!createdAt) return "";
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `(Requested ${diffDays} day${diffDays !== 1 ? "s" : ""} ago)`;
    if (diffHours > 0) return `(Requested ${diffHours} hour${diffHours !== 1 ? "s" : ""} ago)`;
    return `(Requested ${diffMinutes} min${diffMinutes !== 1 ? "s" : ""} ago)`;
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
        <View style={styles.topSection}>
          <View style={styles.iconBox}>
            <FontAwesome5 name="users" size={24} color="#0c92cb" />
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.title} numberOfLines={1}>
              {issueData.title}
            </Text>
            <Text style={styles.timeAgoText}>{getTimeAgo(issueData.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.tagContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{issueData.category || "Infrastructure"}</Text>
            </View>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-pin" size={16} color="#666" />
              <Text style={styles.detailText}>Street/Park</Text>
            </View>
          </View>

          <View style={styles.dateTimeRow}>
            <MaterialIcons name="event" size={16} color="#666" />
            <Text style={styles.detailText}>
              {issueData.date}, {issueData.time}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.supportBtn} activeOpacity={0.8}>
          <Text style={styles.supportBtnText}>
            {issueData.voteCount} Community Supports
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width - 30, // Full width minus horizontal padding in Home.tsx
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#f0f9ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleBox: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  timeAgoText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
    marginTop: 2,
  },
  detailsSection: {
    marginBottom: 15,
    gap: 10,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryBadge: {
    backgroundColor: "#1e5128", // Dark green from the image
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#444",
    fontWeight: "500",
  },
  supportBtn: {
    backgroundColor: "#134e5e", // Dark teal/greenish from the image
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  supportBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default IssueCard;
