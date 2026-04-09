import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const IssueCard2 = ({ issueData, onPress }: any) => {
  const getTimeAgo = (createdAt: string) => {
    if (!createdAt) return "";
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {issueData.title}
        </Text>
        <Text style={styles.timeText}>{getTimeAgo(issueData.createdAt)}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
});

export default IssueCard2;
