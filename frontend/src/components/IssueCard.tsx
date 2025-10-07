import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const IssueCard = ({ issueData}: any) => {
  return (
    <TouchableOpacity
      style={{
        height: 120,
        width: 160,
        backgroundColor: "#f8f9fb",
        borderRadius: 15,
        padding: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        justifyContent: "space-between",
      }}
      activeOpacity={0.8}
    >
      <View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#1a1a1a",
            marginBottom: 5,
          }}
          numberOfLines={2}
        >
          {issueData.title}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
            color: "#666",
          }}
        >
          Date: {issueData.date}
        </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: "#666",
            }}
          >
            Time: {issueData.time}
          </Text>
      </View>

      <View
        style={{
          backgroundColor: "#0c92cbff",
          alignSelf: "flex-start",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "600",
            fontSize: 12,
          }}
        >
          {issueData.voteCount} Votes
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default IssueCard;
