import express from "express";
import Issue from "../models/issue.js";
import authMiddleware from "../services/checkAuth.js";

const router = express.Router();

router.get("/issues", authMiddleware, async (req, res) => {
    console.log("inside get issue")
  try {
    const issues = await Issue.find().populate("createdBy", "name email");
    res.json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.json({ message: "Server error" });
  }
});

export default router;
