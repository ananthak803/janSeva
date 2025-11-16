import express from 'express';
import Issue from '../models/issue.js';
import authMiddleware from '../services/checkAuth.js';
import Resident from "../models/resident.js";
import Vote from "../models/vote.js";
import Department from '../models/department.js';
const router = express.Router();

router.post("/newIssue", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, location, date, time, imageUrl } = req.body;
    const createdBy = req.user.id;

    if (!title || !location?.latitude || !location?.longitude || !date || !time || !imageUrl) {
      return res.json({ msg: "Missing required fields" });
    }

    let assignedDepartment=null
    if (category && category !== "others") {
      const department = await Department.findOne({
        categoryHandled: category,
      });
      if (department) {
        assignedDepartment = department._id;
      }
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
      assignedDepartment,
      status:assignedDepartment?"assigned":"pending",
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
    const radius = 10; // radius in km

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

export default router;
