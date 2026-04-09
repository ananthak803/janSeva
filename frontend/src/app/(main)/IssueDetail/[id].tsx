import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import CustomSafeArea from "@/src/components/CustomSafeArea";
import LoadingScreen from "@/src/components/LoadingScreen";

const { height } = Dimensions.get("window");

const IssueDetailPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const API = process.env.EXPO_PUBLIC_BACKEND_API;

  const timelineSteps = [
    { id: "verified", label: "Verified", icon: "verified" },
    { id: "assigned", label: "Assigned", icon: "assignment-ind" },
    { id: "in-progress", label: "In Progress", icon: "engineering" },
    { id: "resolved", label: "Completed", icon: "check-circle" },
  ];

  const fetchComments = async () => {
    if (!API || !id) return;
    try {
      const token = await SecureStore.getItemAsync("access_token");
      const res = await axios.get(`${API}/api/issue/getComments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.log("Error fetching comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const token = await SecureStore.getItemAsync("access_token");
      const res = await axios.post(`${API}/api/issue/addComment`, {
        issueId: id,
        text: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.log("Error adding comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  useEffect(() => {
    const fetchIssueDetails = async () => {
      if (!API || !id) return;
      try {
        const token = await SecureStore.getItemAsync("access_token");
        const res = await axios.get(`${API}/api/issue/getIssue`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data.find((i: any) => i._id === id);
        if (found) {
          setIssue(found);
        } else {
          const userRes = await axios.get(`${API}/api/issue/getUserIssue`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userFound = userRes.data.find((i: any) => i._id === id);
          setIssue(userFound);
        }
        await fetchComments();
      } catch (err) {
        console.log("Error fetching issue detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssueDetails();
  }, [id]);

  const getStepStatus = (stepId: string) => {
    const statusOrder = ["pending", "verified", "assigned", "in-progress", "resolved"];
    const currentStatus = issue?.status?.toLowerCase() || "pending";
    
    let effectiveStatus = currentStatus;
    if (currentStatus === "assigned" || currentStatus === "in-progress" || currentStatus === "resolved") {
      if (stepId === "verified") return "completed";
    }

    const currentIndex = statusOrder.indexOf(effectiveStatus);
    const stepIndex = statusOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved": return "#4CAF50";
      case "pending": return "#FFC107";
      case "in-progress": return "#0c92cb";
      default: return "#999";
    }
  };

  if (loading) return <LoadingScreen />;
  if (!issue) return (
    <CustomSafeArea>
      <View style={styles.errorContainer}>
        <Text>Issue not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#0c92cb', marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </CustomSafeArea>
  );

  return (
    <CustomSafeArea>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Issue Details</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Fixed-looking Top Section */}
            <View style={styles.topDetails}>
              {issue?.imageUrl ? (
                <Image source={{ uri: issue.imageUrl }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="image" size={50} color="#ccc" />
                  <Text style={styles.placeholderText}>No image available</Text>
                </View>
              )}

              <View style={styles.body}>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(issue?.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {issue?.status || "Pending"}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>
                    {issue?.date} • {issue?.time}
                  </Text>
                </View>

                <Text style={styles.title}>{issue?.title}</Text>
                
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Description</Text>
                  <Text style={styles.description}>{issue?.description || "No description provided."}</Text>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <MaterialIcons name="category" size={20} color="#0c92cb" />
                    <View>
                      <Text style={styles.infoLabel}>Category</Text>
                      <Text style={styles.infoValue}>{issue?.category || "General"}</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <MaterialIcons name="thumb-up" size={20} color="#0c92cb" />
                    <View>
                      <Text style={styles.infoLabel}>Supports</Text>
                      <Text style={styles.infoValue}>{issue?.voteCount || 0} People</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.timelineContainer}>
                  <Text style={styles.sectionLabel}>Progress Timeline</Text>
                  <View style={styles.horizontalTimeline}>
                    {timelineSteps.map((step, index) => {
                      const status = getStepStatus(step.id);
                      const isLast = index === timelineSteps.length - 1;
                      const isEven = index % 2 === 0;
                      
                      return (
                        <View key={step.id} style={styles.hTimelineItem}>
                          {/* Top Label (for even items) */}
                          <View style={styles.labelContainer}>
                            {isEven && (
                              <Text style={[
                                styles.hTimelineLabel,
                                status !== "pending" && styles.labelActive
                              ]}>
                                {step.label}
                              </Text>
                            )}
                          </View>

                          {/* Dot and Line */}
                          <View style={styles.dotLineSection}>
                            {!isLast && (
                              <View style={[
                                styles.hTimelineLine,
                                status === "completed" && styles.lineCompleted
                              ]} />
                            )}
                            <View style={[
                              styles.timelineDot,
                              status === "completed" && styles.dotCompleted,
                              status === "active" && styles.dotActive,
                            ]}>
                              {status === "completed" ? (
                                <MaterialIcons name="check" size={10} color="#fff" />
                              ) : (
                                <View style={styles.dotInner} />
                              )}
                            </View>
                          </View>

                          {/* Bottom Label (for odd items) */}
                          <View style={styles.labelContainer}>
                            {!isEven && (
                              <Text style={[
                                styles.hTimelineLabel,
                                status !== "pending" && styles.labelActive
                              ]}>
                                {step.label}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>

            {/* Comments Section */}
            <View style={styles.commentsContainer}>
              <Text style={styles.sectionLabel}>Comments ({comments.length})</Text>
              {comments.map((comment) => (
                <View key={comment._id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{comment.userName}</Text>
                    <Text style={styles.commentTime}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}
              {comments.length === 0 && (
                <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
              )}
            </View>
          </ScrollView>

          {/* Fixed Comment Input at Bottom */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !newComment.trim() && styles.sendBtnDisabled]}
              onPress={handleAddComment}
              disabled={!newComment.trim() || submittingComment}
            >
              <MaterialIcons name="send" size={24} color={newComment.trim() ? "#0c92cb" : "#ccc"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topDetails: {
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 10,
    color: "#999",
    fontWeight: "600",
  },
  body: {
    padding: 20,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  dateText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  timelineContainer: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#fbfcfd',
    paddingVertical: 25,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  horizontalTimeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  hTimelineItem: {
    flex: 1,
    alignItems: 'center',
  },
  dotLineSection: {
    height: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  labelContainer: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hTimelineLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999',
    textAlign: 'center',
  },
  hTimelineLine: {
    position: 'absolute',
    top: 9,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#e0e0e0',
    zIndex: 1,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  dotCompleted: {
    backgroundColor: '#4CAF50',
  },
  dotActive: {
    backgroundColor: '#0c92cb',
    borderWidth: 2,
    borderColor: '#e1f5fe',
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  lineCompleted: {
    backgroundColor: '#4CAF50',
  },
  labelActive: {
    color: '#1a1a1a',
    fontWeight: '800',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    color: "#999",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 12,
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "700",
  },
  commentsContainer: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  commentItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  commentTime: {
    fontSize: 11,
    color: "#999",
  },
  commentText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  noComments: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
    color: "#1a1a1a",
  },
  sendBtn: {
    marginLeft: 10,
    padding: 5,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IssueDetailPage;
