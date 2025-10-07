import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Resident from '../models/resident.js';
import dotenv from 'dotenv';
import authMiddleware from '../services/checkAuth.js';
dotenv.config()
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email,phone, password } = req.body;

  try {
    let existingEmail = await Resident.findOne({ email });
    if (existingEmail) return res.json({ msg: "email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Resident({
      email,
      phone,
      password_hash:hashedPassword
    });
    await newUser.save();

    const payload = { id: newUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.send("Server error in routes/auth.js");
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user
    const user = await Resident.findOne({ email });
    if (!user) return res.json({ msg: "Invalid credentials" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.json({ msg: "Invalid credentials" });

    // sign JWT
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "defaultsecret", {
      expiresIn: "30d"
    });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error in /login");
  }
});

router.put("/updateLocation", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { location } = req.body;

    if (!location?.type || !location?.coordinates) {
      return res.status(400).json({ msg: "Invalid location format" });
    }

    const updatedResident = await Resident.findByIdAndUpdate(
      userId,
      { location },
      { new: true }
    );

    res.json({ msg: "Location updated", resident: updatedResident });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
