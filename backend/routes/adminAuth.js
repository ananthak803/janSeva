import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
// import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("indis login")
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });
    const isMatch= password.trim()==admin.password.trim();
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
