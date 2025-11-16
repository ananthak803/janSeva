import express from "express";
import Issue from "../models/issue.js";
import authMiddleware from "../services/checkAuth.js";
import Department from "../models/department.js";

const router = express.Router();

router.get("/issues", authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find({})
      .populate("assignedDepartment");  // <-- FIX

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
router.get("/departments", authMiddleware, async (req, res) => {
  try {
    const departments = await Department.find({});

    res.json({
      success: true,
      count: departments.length,
      departments,
    });

  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/pendingIssues", authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find({status:"pending"});
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

router.put("/assign/:id", authMiddleware, async (req, res) => {
  try {
    const { departmentId } = req.body;

    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        assignedDepartment: departmentId,
        status: "assigned",
      },
      { new: true }
    ).populate("assignedDepartment"); // <-- important

    res.json({ success: true, issue: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/solve/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        status: "resolved",
      },
      { new: true }
    )

    res.json({ success: true, issue: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;
