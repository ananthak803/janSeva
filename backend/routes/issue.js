import express from 'express';
import Issue from '../models/issue.js'; 
import authMiddleware from '../services/checkAuth.js'; 
import Resident from "../models/resident.js";
import Comment from '../models/comment.js';
import Vote from "../models/vote.js";
const router = express.Router();

router.post("/newIssue", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, location, date, time, imageUrl } = req.body;
    const createdBy = req.user.id;

    if (!title || !location?.latitude || !location?.longitude || !date || !time || !imageUrl) {
      return res.json({ msg: "Missing required fields" });
    }

    const newIssue = new Issue({
      title,
      description,
      category,
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      date,
      time,
      imageUrl,
      createdBy,
    });

    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (error) {
    console.error("Error creating issue:", error);
    res.json({ msg: "Server error" });
  }
});


router.get("/getIssue", authMiddleware, async (req, res) => {
  try {
    console.log("User ID from auth:", req.user.id);
    const userId = req.user.id;

    const resident = await Resident.findById(userId);
    console.log("Resident:", resident);

    if (!resident?.location?.coordinates || resident.location.coordinates.length !== 2) {
      return res.status(404).json({ msg: "Resident location not found" });
    }

    const [longitude, latitude] = resident.location.coordinates;
    const radius = 5; // radius in km

    const issues = await Issue.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / 6378.1],
        },
      },
    })
      .sort({ voteCount: -1, createdAt: -1 }) 
      .limit(5); 

    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});


router.get("/getUserIssue", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const userIssues = await Issue.find({ createdBy: userId })
      .sort({ createdAt: -1 });

    res.json(userIssues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post('/addComment',authMiddleware,async(req,res)=>{
  try{
    const {issueId,text,date,time} =req.body;
    const commentedBy=req.user.id
    const newComment = new Comment({
      issueId,
      text,
      commentedBy
    })
  }
  catch{
    console.error(error);
    res.status(500).json({msg:"An Error Occured"});
  }
})


router.post('/addVote', authMiddleware, async (req, res) => {
  try {
    const { issueId } = req.body;
    const userId = req.user.id;
    const existingVote = await Vote.findOne({ issueId, userId });
    if (existingVote) {
      return res.json({ msg: "User has already voted for this issue" });
    }

    const newVote = new Vote({ issueId, userId });
    await newVote.save();

    // Increment voteCount for the issue
    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      { $inc: { voteCount: 1 } },
      { new: true }
    );

    res.status(201).json({ msg: "Vote added", voteCount: updatedIssue.voteCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/comments/:issueId", authMiddleware, async (req, res) => {
  const { issueId } = req.params;
  try {
    const comments = await Comment.find({ issueId })
      .populate("commentedBy", "name") // populate with resident's name if needed
      .sort({ createdAt: 1 }); // oldest first

    // Format the response to include commenter name
    const formattedComments = comments.map((c) => ({
      _id: c._id,
      text: c.text,
      date: c.date,
      time: c.time,
      commentedByName: c.commentedBy?.name || "Anonymous",
    }));

    res.status(200).json(formattedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Route to add a new comment
router.post("/addComment", authMiddleware, async (req, res) => {
  try {
    const { issueId, text } = req.body;
    const commentedBy = req.user.id;

    if (!issueId || !text) {
      return res.status(400).json({ msg: "Missing issueId or text" });
    }

    const dateObj = new Date();
    const date = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = dateObj.toTimeString().split(" ")[0]; // HH:MM:SS

    const newComment = new Comment({
      issueId,
      text,
      commentedBy,
      date,
      time,
    });

    const savedComment = await newComment.save();

    // Return saved comment with populated commenter name for convenience
    const populatedComment = await savedComment
      .populate("commentedBy", "name")
      .execPopulate();

    res.status(201).json({
      _id: populatedComment._id,
      text: populatedComment.text,
      date: populatedComment.date,
      time: populatedComment.time,
      commentedByName: populatedComment.commentedBy?.name || "Anonymous",
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
