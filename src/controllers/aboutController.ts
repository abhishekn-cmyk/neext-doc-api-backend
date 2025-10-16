import { RequestHandler } from "express";
import About from "../models/About";

// ✅ Create About
const createAbout: RequestHandler = async (req, res) => {
  try {
    const aboutData = req.body;
    const about = new About(aboutData);
    await about.save();
    res.status(201).json({ success: true, data: about });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get All
const getAbouts: RequestHandler = async (req, res) => {
  try {
    const abouts = await About.find();
    res.status(200).json({ success: true, data: abouts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get One
const getAboutById: RequestHandler = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      res.status(404).json({ success: false, message: "About not found" });
      return;
    }
    res.status(200).json({ success: true, data: about });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update
const updateAbout: RequestHandler = async (req, res) => {
  try {
    const about = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!about) {
      res.status(404).json({ success: false, message: "About not found" });
      return;
    }
    res.status(200).json({ success: true, data: about });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete
const deleteAbout: RequestHandler = async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);
    if (!about) {
      res.status(404).json({ success: false, message: "About not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  createAbout,
  getAbouts,
  getAboutById,
  updateAbout,
  deleteAbout,
};
