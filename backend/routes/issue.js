import express from 'express';
import Issue from '../models/issue.js'; 
import authMiddleware from '../services/checkAuth.js'; 
import Resident from "../models/resident.js";
import Comment from '../models/comment.js';
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

  }
})


export default router;
