import express from 'express';
import Issue from '../models/issue.js'; 
import authMiddleware from '../services/checkAuth.js'; 
import Vote from "../models/vote.js";
const router = express.Router();

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

// Optional: Route to remove vote (unvote)
// router.delete('/removeVote', authMiddleware, async (req, res) => {
//   try {
//     const { issueId } = req.body;
//     const userId = req.user.id;

//     const deletedVote = await Vote.findOneAndDelete({ issueId, userId });
//     if (!deletedVote) {
//       return res.status(404).json({ msg: "Vote not found" });
//     }

//     // Decrement voteCount for the issue
//     const updatedIssue = await Issue.findByIdAndUpdate(
//       issueId,
//       { $inc: { voteCount: -1 } },
//       { new: true }
//     );

//     res.json({ msg: "Vote removed", voteCount: updatedIssue.voteCount });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });
