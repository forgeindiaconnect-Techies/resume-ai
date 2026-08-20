const UserSession = require("../models/UserSession");
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.json');
const isDBConnected = () => mongoose.connection.readyState === 1;

// Local JSON Helpers
const getLocalCollection = (key) => {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data || '{}');
    return parsed[key] || [];
  } catch (e) {
    return [];
  }
};

const saveLocalCollection = (key, dataArray) => {
  try {
    let db = {};
    if (fs.existsSync(DB_PATH)) {
      const dbData = fs.readFileSync(DB_PATH, 'utf8');
      db = JSON.parse(dbData || '{}');
    }
    db[key] = dataArray;
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error(`Failed to save to local JSON ${key}`, e);
  }
};

exports.startSession = async (req, res) => {
  try {
    const { sessionId, guestId, userId, email, currentPage } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    if (isDBConnected()) {
      let session = await UserSession.findOne({ sessionId });
      if (!session) {
        session = new UserSession({
          sessionId,
          guestId: guestId || null,
          userId: userId || null,
          email: email || null,
          currentPage: currentPage || "/",
          events: [{ action: "Session Started", page: currentPage || "/" }]
        });
      } else {
        session.status = "active";
        session.exitTime = null;
        session.lastActiveTime = new Date();
        session.currentPage = currentPage || "/";
        session.events.push({ action: "Session Resumed", page: currentPage || "/" });
      }
      await session.save();
      return res.status(200).json({ success: true, session });
    } else {
      // Local DB Logic
      const sessions = getLocalCollection('userSessions');
      let session = sessions.find(s => s.sessionId === sessionId);
      if (!session) {
        session = {
          _id: new Date().getTime().toString(),
          sessionId,
          guestId: guestId || null,
          userId: userId || null,
          email: email || null,
          entryTime: new Date().toISOString(),
          lastActiveTime: new Date().toISOString(),
          exitTime: null,
          currentPage: currentPage || "/",
          resumeCreated: false,
          resumeId: null,
          downloadType: "none",
          downloaded: false,
          downloadedAt: null,
          status: "active",
          events: [{ action: "Session Started", page: currentPage || "/", timestamp: new Date().toISOString() }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        sessions.push(session);
        saveLocalCollection('userSessions', sessions);
      }
      return res.status(200).json({ success: true, session });
    }
  } catch (error) {
    console.error("Start session error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.trackEvent = async (req, res) => {
  try {
    const { sessionId, action, page, extraData, resumeName, email, resumeId, resumeCreated } = req.body;

    if (!sessionId || !action) {
      return res.status(400).json({ success: false, message: "sessionId and action are required" });
    }

    if (isDBConnected()) {
      let session = await UserSession.findOne({ sessionId });
      if (!session) return res.status(404).json({ success: false, message: "Session not found" });

      session.lastActiveTime = Date.now();
      session.currentPage = page || session.currentPage;
      session.events.push({ action, page: page || session.currentPage });

      // Handle specific actions
      if (extraData) {
        if (extraData.resumeCreated) session.resumeCreated = true;
        if (extraData.resumeId) session.resumeId = extraData.resumeId;
        if (extraData.downloadType) session.downloadType = extraData.downloadType;
        if (extraData.downloaded) {
          session.downloaded = true;
          session.downloadedAt = Date.now();
        }
      }

      if (resumeName && resumeName !== "Your Name") {
        session.resumeName = resumeName;
      }

      if (email) {
        session.email = email.trim().toLowerCase();
      }

      if (action === "RESUME_CREATED" || action === "Resume Auto-Saved" || resumeCreated) {
        session.resumeCreated = true;
        if (resumeId) {
          session.resumeId = resumeId;
        }
      }

      await session.save();
      return res.status(200).json({ success: true, session });
    } else {
      const sessions = getLocalCollection('userSessions');
      const sessionIndex = sessions.findIndex(s => s.sessionId === sessionId);
      if (sessionIndex === -1) return res.status(404).json({ success: false, message: "Session not found" });

      let session = sessions[sessionIndex];
      session.lastActiveTime = new Date().toISOString();
      session.currentPage = page || session.currentPage;
      session.events.push({ action, page: page || session.currentPage, timestamp: new Date().toISOString() });

      if (extraData) {
        if (extraData.resumeCreated) session.resumeCreated = true;
        if (extraData.resumeId) session.resumeId = extraData.resumeId;
        if (extraData.downloadType) session.downloadType = extraData.downloadType;
        if (extraData.downloaded) {
          session.downloaded = true;
          session.downloadedAt = new Date().toISOString();
        }
      }

      if (resumeName && resumeName !== "Your Name") {
        session.resumeName = resumeName;
      }

      if (email) {
        session.email = email.trim().toLowerCase();
      }

      if (action === "RESUME_CREATED" || action === "Resume Auto-Saved" || resumeCreated) {
        session.resumeCreated = true;
        if (resumeId) {
          session.resumeId = resumeId;
        }
      }
      session.updatedAt = new Date().toISOString();

      sessions[sessionIndex] = session;
      saveLocalCollection('userSessions', sessions);
      return res.status(200).json({ success: true, session });
    }
  } catch (error) {
    console.error("Track event error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: "sessionId is required" });

    if (isDBConnected()) {
      let session = await UserSession.findOne({ sessionId });
      if (session) {
        session.exitTime = Date.now();
        session.status = "exited";
        session.events.push({ action: "Session Ended", page: session.currentPage });
        await session.save();
      }
      return res.status(200).json({ success: true });
    } else {
      const sessions = getLocalCollection('userSessions');
      const sessionIndex = sessions.findIndex(s => s.sessionId === sessionId);
      if (sessionIndex !== -1) {
        sessions[sessionIndex].exitTime = new Date().toISOString();
        sessions[sessionIndex].status = "exited";
        sessions[sessionIndex].events.push({ action: "Session Ended", page: sessions[sessionIndex].currentPage, timestamp: new Date().toISOString() });
        sessions[sessionIndex].updatedAt = new Date().toISOString();
        saveLocalCollection('userSessions', sessions);
      }
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error("End session error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    if (isDBConnected()) {
      const sessions = await UserSession.find({}).sort({ entryTime: -1 });
      return res.status(200).json({ success: true, sessions });
    } else {
      const sessions = getLocalCollection('userSessions').sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));
      return res.status(200).json({ success: true, sessions });
    }
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
