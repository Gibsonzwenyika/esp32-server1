const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://esp32admin:1234@cluster0.1davypg.mongodb.net/smart_iot?retryWrites=true&w=majority&appName=Cluster0"; 

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema for face logs
const FaceLogSchema = new mongoose.Schema({
    imageUrl: String,       // stored image link (or base64 for testing)
    status: String,         // "known" or "unknown"
    timestamp: { type: Date, default: Date.now }
});

const FaceLog = mongoose.model("FaceLog", FaceLogSchema);

// Routes
app.get("/", (req, res) => {
    res.send("ESP32 Face Unlock Server Running ✅");
});

// Save new log
app.post("/log", async (req, res) => {
    try {
        const { imageUrl, status } = req.body;
        const log = new FaceLog({ imageUrl, status });
        await log.save();
        res.status(201).json({ message: "Log saved", log });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch all logs
app.get("/logs", async (req, res) => {
    try {
        const logs = await FaceLog.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Mongo Schema
const LogSchema = new mongoose.Schema({
  image: Buffer,
  status: String,
  timestamp: { type: Date, default: Date.now }
});
const Log = mongoose.model("Log", LogSchema);

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const log = new Log({
      image: req.file.buffer,
      status: "face_detected"
    });
    await log.save();
    res.send("✅ Image saved");
  } catch (err) {
    res.status(500).send("❌ Upload failed: " + err.message);
  }
});


app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

