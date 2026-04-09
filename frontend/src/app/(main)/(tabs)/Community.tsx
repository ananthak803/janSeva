//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import CustomSafeArea from "@/src/components/CustomSafeArea";
import { useSelector } from "react-redux";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useRouter } from "expo-router";

const Community = () => {
  const localIssue = useSelector((state) => state.issues.localIssues);
  const [voteCounts, setVoteCounts] = useState({});
  const router = useRouter();

  useEffect(() => {
    const counts = {};
    localIssue.forEach((issue) => {
      counts[issue._id] = issue.voteCount || 0;
    });
    setVoteCounts(counts);
  }, [localIssue]);

  const handleIssuePress = (issue) => {
    router.push(`/IssueDetail/${issue._id}`);
  };

  const sendVote = async (issueId) => {
    const token = await SecureStore.getItemAsync("access_token");
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_API}/api/issue/addVote`,
        { issueId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const newCount = response.data.voteCount;
        setVoteCounts((prev) => ({ ...prev, [issueId]: newCount }));
      }
    } catch (error) {
      console.error("Error sending vote:", error);
    }
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.95}
      onPress={() => handleIssuePress(item)}
    >
      {/* Top Header: Category & Time */}
      <View style={styles.cardTopRow}>
        <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(item.category) }]}>
          <Text style={styles.categoryTagText}>{item.category || "General"}</Text>
        </View>
        <Text style={styles.timeAgoText}>{getTimeAgo(item.createdAt)}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      {/* Media Section */}
      {item.imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          <View style={styles.imageOverlay}>
            <MaterialIcons name="zoom-out-map" size={20} color="#fff" />
          </View>
        </View>
      )}

      {/* Interaction Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={[styles.interactionBtn, styles.supportBtn]}
            onPress={(e) => {
              e.stopPropagation();
              sendVote(item._id);
            }}
          >
            <MaterialIcons name="arrow-upward" size={20} color="#0c92cb" />
            <Text style={styles.supportCountText}>{voteCounts[item._id] ?? 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.interactionBtn}
            onPress={(e) => {
              e.stopPropagation();
              handleIssuePress(item);
            }}
          >
            <MaterialIcons name="chat-bubble-outline" size={18} color="#666" />
            <Text style={styles.interactionText}>Discuss</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.mapBtn}
          onPress={(e) => {
            e.stopPropagation();
            if (item.location?.coordinates) {
              const [lng, lat] = item.location.coordinates;
              const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
              Linking.openURL(url);
            }
          }}
        >
          <MaterialIcons name="near-me" size={18} color="#666" />
          <Text style={styles.interactionText}>Map</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getCategoryColor = (cat) => {
    switch(cat?.toLowerCase()) {
      case 'water': return '#03a9f4';
      case 'power': return '#ff9800';
      case 'pwd': return '#795548';
      case 'sanitation': return '#4caf50';
      default: return '#607d8b';
    }
  };

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return "";
    const diff = new Date().getTime() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    return `${mins}m ago`;
  };

  return (
    <CustomSafeArea>
      <View style={styles.main}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerTitle}>Community Feed</Text>
          <Text style={styles.headerSub}>See what's happening around you</Text>
        </View>
        <FlatList
          data={localIssue}
          keyExtractor={(item) => item._id}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
  },
  headerSub: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },
  listContainer: {
    padding: 12,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timeAgoText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  cardBody: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  imageContainer: {
    width: "100%",
    height: 160, // Reduced from 220
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    padding: 6,
    borderRadius: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  leftActions: {
    flexDirection: "row",
    gap: 12,
  },
  interactionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
  },
  supportBtn: {
    backgroundColor: "#f0f9ff",
  },
  supportCountText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0c92cb",
  },
  interactionText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "700",
  },
  mapBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});

export default Community;
