import { Text, TouchableOpacity, View } from "react-native";
import React from "react";

const IssueCard2 = ({ issueData}: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        minHeight: 100,
        minWidth: "100%",
        backgroundColor: "#f8f9fb",
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
        elevation: 3,
        marginVertical: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      {/* Top Row: Title + Status */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 4,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            flex: 1,
            color: "#1a1a1a",
          }}
          numberOfLines={1}
        >
          {issueData.title}
        </Text>
        <View
          style={{
            backgroundColor:
              issueData.status === "Resolved"
                ? "#4CAF50"
                :issueData.status === "Pending"
                ? "#FFC107"
                : "#0c92cbff",
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 10,
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            {issueData.status || "Pending"}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 13,
          color: "#444",
          fontWeight: "400",
          marginBottom: 6,
        }}
        numberOfLines={3}
      >
        {issueData.description}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 11, color: "#555", fontWeight: "500" }}>
           {issueData.date}
        </Text>
          <Text style={{ fontSize: 11, color: "#555", fontWeight: "500" }}>
             {issueData.time}
          </Text>
      </View>
    </TouchableOpacity>
  );
};

export default IssueCard2;
