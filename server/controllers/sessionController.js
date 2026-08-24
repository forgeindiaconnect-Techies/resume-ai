const UserSession = require("../models/UserSession");
const Download = require("../models/Download");
const Resume = require("../models/Resume");
const User = require("../models/User");
const Payment = require("../models/Payment");
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

const cleanName = (name) => {
  if (!name) return null;
  const trimmed = String(name).trim();
  const lower = trimmed.toLowerCase();
  if (
    lower === "null" ||
    lower === "undefined" ||
    lower === ""
  ) {
    return null;
  }
  return trimmed;
};

const cleanEmail = (email) => {
  if (!email) return null;
  const trimmed = String(email).trim().toLowerCase();
  if (
    trimmed === "your.email@example.com" ||
    trimmed === "dev@email.com" ||
    trimmed === "null" ||
    trimmed === "undefined" ||
    trimmed === ""
  ) {
    return null;
  }
  return trimmed;
};

exports.startSession = async (req, res) => {
  try {
    const { sessionId, guestId, userId, email, resumeName, currentPage } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    const cEmail = cleanEmail(email);
    const cName = cleanName(resumeName);

    if (isDBConnected()) {
      const setFields = {
        status: "active",
        exitTime: null,
        lastActiveTime: new Date(),
        currentPage: currentPage || "/"
      };
      if (guestId) setFields.guestId = guestId;
      if (userId) setFields.userId = userId;
      if (cEmail) setFields.email = cEmail;
      if (cName) setFields.resumeName = cName;

      const session = await UserSession.findOneAndUpdate(
        { sessionId },
        {
          $setOnInsert: {
            sessionId,
            guestId: guestId || null,
            userId: userId || null,
            email: cEmail || null,
            resumeName: cName || null,
            entryTime: new Date()
          },
          $set: setFields,
          $push: {
            events: {
              action: "Session Started",
              page: currentPage || "/",
              timestamp: new Date()
            }
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return res.status(200).json({ success: true, session });
    } else {
      const sessions = getLocalCollection('userSessions');
      let session = sessions.find(s => s.sessionId === sessionId);
      if (!session) {
        session = {
          _id: new Date().getTime().toString(),
          sessionId,
          guestId: guestId || null,
          userId: userId || null,
          email: cEmail || null,
          resumeName: cName || null,
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
    if (error.code === 11000) {
      // Gracefully handle any race condition duplicate key
      const session = await UserSession.findOne({ sessionId: req.body.sessionId });
      return res.status(200).json({ success: true, session });
    }
    console.error("Start session error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.trackEvent = async (req, res) => {
  try {
    const { sessionId, guestId, action, page, extraData, resumeName, email, resumeId, resumeCreated, downloadType, downloaded } = req.body;

    if (!sessionId || !action) {
      return res.status(400).json({ success: false, message: "sessionId and action are required" });
    }

    const cName = cleanName(resumeName || extraData?.resumeName);
    const cEmail = cleanEmail(email || extraData?.email);
    const effResumeId = resumeId || extraData?.resumeId;
    const effResumeCreated = resumeCreated || extraData?.resumeCreated || action === "RESUME_CREATED" || action === "Resume Auto-Saved";
    const effDownloadType = downloadType || extraData?.downloadType;
    const effDownloaded = downloaded || extraData?.downloaded || action === "RESUME_DOWNLOADED" || action === "DOWNLOAD_WITHOUT_WATERMARK" || action === "DOWNLOAD_WITH_WATERMARK";

    if (isDBConnected()) {
      const setFields = {
        lastActiveTime: new Date(),
        currentPage: page || "/"
      };
      if (guestId) setFields.guestId = guestId;
      if (cName) setFields.resumeName = cName;
      if (cEmail) setFields.email = cEmail;
      if (effResumeCreated) setFields.resumeCreated = true;
      if (effResumeId) setFields.resumeId = effResumeId;
      if (effDownloadType) setFields.downloadType = effDownloadType;
      if (effDownloaded) {
        setFields.downloaded = true;
        setFields.downloadedAt = new Date();
      }

      const session = await UserSession.findOneAndUpdate(
        { sessionId },
        {
          $setOnInsert: {
            sessionId,
            guestId: guestId || null,
            userId: null,
            entryTime: new Date(),
            status: "active"
          },
          $set: setFields,
          $push: {
            events: {
              action,
              page: page || "/",
              timestamp: new Date()
            }
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return res.status(200).json({ success: true, session });
    } else {
      const sessions = getLocalCollection('userSessions');
      let sessionIndex = sessions.findIndex(s => s.sessionId === sessionId);
      let session;

      if (sessionIndex === -1) {
        session = {
          _id: new Date().getTime().toString(),
          sessionId,
          guestId: guestId || null,
          userId: null,
          email: cEmail || null,
          resumeName: cName || null,
          entryTime: new Date().toISOString(),
          lastActiveTime: new Date().toISOString(),
          exitTime: null,
          currentPage: page || "/",
          resumeCreated: Boolean(effResumeCreated),
          resumeId: effResumeId || null,
          downloadType: effDownloadType || "none",
          downloaded: Boolean(effDownloaded),
          downloadedAt: effDownloaded ? new Date().toISOString() : null,
          status: "active",
          events: [{ action, page: page || "/", timestamp: new Date().toISOString() }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        sessions.push(session);
      } else {
        session = sessions[sessionIndex];
        session.lastActiveTime = new Date().toISOString();
        session.currentPage = page || session.currentPage;
        session.events.push({ action, page: page || session.currentPage, timestamp: new Date().toISOString() });

        if (guestId && !session.guestId) session.guestId = guestId;
        if (cName) session.resumeName = cName;
        if (cEmail) session.email = cEmail;
        if (effResumeCreated) session.resumeCreated = true;
        if (effResumeId) session.resumeId = effResumeId;
        if (effDownloadType) session.downloadType = effDownloadType;
        if (effDownloaded) {
          session.downloaded = true;
          session.downloadedAt = session.downloadedAt || new Date().toISOString();
        }
        session.updatedAt = new Date().toISOString();
        sessions[sessionIndex] = session;
      }

      saveLocalCollection('userSessions', sessions);
      return res.status(200).json({ success: true, session });
    }
  } catch (error) {
    if (error.code === 11000) {
      // Gracefully handle any race condition duplicate key
      const session = await UserSession.findOne({ sessionId: req.body.sessionId });
      return res.status(200).json({ success: true, session });
    }
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
        session.exitTime = new Date();
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
    let enrichedSessions = [];

    if (isDBConnected()) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      try {
        await UserSession.updateMany(
          {
            status: "active",
            exitTime: null,
            lastActiveTime: { $lt: fiveMinutesAgo }
          },
          {
            $set: {
              status: "exited"
            }
          }
        );
      } catch (e) {
        // Non-blocking
      }

      let sessions = [];
      let downloads = [];
      let resumes = [];
      let users = [];
      let payments = [];

      try { sessions = await UserSession.find({}).sort({ entryTime: -1 }).lean(); } catch (e) {}
      try { downloads = await Download.find({}).lean(); } catch (e) {}
      try { resumes = await Resume.find({}).lean(); } catch (e) {}
      try { users = await User.find({}).select("-password").lean(); } catch (e) {}
      try { payments = await Payment.find({}).lean(); } catch (e) {}

      if (!Array.isArray(sessions)) sessions = [];
      if (!Array.isArray(downloads)) downloads = [];
      if (!Array.isArray(resumes)) resumes = [];
      if (!Array.isArray(users)) users = [];
      if (!Array.isArray(payments)) payments = [];

      // Maps for rapid lookup
      const downloadBySession = new Map();
      const downloadByGuest = new Map();
      const downloadByEmail = new Map();

      downloads.forEach(d => {
        if (d?.sessionId) downloadBySession.set(d.sessionId, d);
        if (d?.guestId) downloadByGuest.set(d.guestId, d);
        if (d?.email) downloadByEmail.set(String(d.email).toLowerCase(), d);
      });

      const resumeByUser = new Map();
      const resumeById = new Map();
      resumes.forEach(r => {
        if (r?.userId) resumeByUser.set(r.userId.toString(), r);
        if (r?.resumeId) resumeById.set(r.resumeId, r);
        if (r?._id) resumeById.set(r._id.toString(), r);
      });

      const userById = new Map();
      const userByEmail = new Map();
      users.forEach(u => {
        if (u?._id) userById.set(u._id.toString(), u);
        if (u?.userId) userById.set(u.userId, u);
        if (u?.email) userByEmail.set(String(u.email).toLowerCase(), u);
      });

      const paymentByEmail = new Map();
      payments.forEach(p => {
        if (p?.email) paymentByEmail.set(String(p.email).toLowerCase(), p);
      });

      // Enrich every existing session
      enrichedSessions = sessions.map(session => {
        const enriched = { ...session };

        // Check matching download
        const dl =
          (session.sessionId && downloadBySession.get(session.sessionId)) ||
          (session.guestId && downloadByGuest.get(session.guestId)) ||
          (session.email && downloadByEmail.get(String(session.email).toLowerCase())) ||
          null;

        if (dl) {
          if (!enriched.resumeName && cleanName(dl.resumeName)) enriched.resumeName = cleanName(dl.resumeName);
          if (!enriched.email && cleanEmail(dl.email)) enriched.email = cleanEmail(dl.email);
          enriched.downloaded = true;
          enriched.downloadType = dl.downloadType || enriched.downloadType;
          enriched.downloadedAt = enriched.downloadedAt || dl.downloadedAt;
          enriched.resumeCreated = true;
        }

        // Check matching resume
        const resObj =
          (session.userId && resumeByUser.get(session.userId.toString())) ||
          (session.resumeId && resumeById.get(session.resumeId)) ||
          null;

        if (resObj) {
          enriched.resumeCreated = true;
          const resName = cleanName(resObj.personalInfo?.name || resObj.personalInfo?.fullName || resObj.title);
          const resEmail = cleanEmail(resObj.personalInfo?.email);
          if (!enriched.resumeName && resName) enriched.resumeName = resName;
          if (!enriched.email && resEmail) enriched.email = resEmail;
        }

        // Check matching user
        const usr =
          (session.userId && userById.get(session.userId.toString())) ||
          (session.email && userByEmail.get(String(session.email).toLowerCase())) ||
          null;

        if (usr) {
          const usrName = cleanName(usr.name);
          const usrEmail = cleanEmail(usr.email);
          if (!enriched.resumeName && usrName) enriched.resumeName = usrName;
          if (!enriched.email && usrEmail) enriched.email = usrEmail;
        }

        // Check matching payment
        if (enriched.email) {
          const pmt = paymentByEmail.get(String(enriched.email).toLowerCase());
          if (pmt) {
            if (!enriched.resumeName && cleanName(pmt.resumeName)) {
              enriched.resumeName = cleanName(pmt.resumeName);
            }
          }
        }

        // Clean up status & exit time if inactive
        if (enriched.status === "active" && !enriched.exitTime) {
          const lastActive = new Date(enriched.lastActiveTime || enriched.entryTime || Date.now());
          if (Date.now() - lastActive.getTime() > 5 * 60 * 1000) {
            enriched.status = "exited";
            enriched.exitTime = lastActive;
          }
        }

        return enriched;
      });

      // Also ensure any downloads that might not have a session are represented
      const existingSessionIds = new Set(enrichedSessions.map(s => s.sessionId).filter(Boolean));
      const existingEmails = new Set(enrichedSessions.map(s => s.email?.toLowerCase()).filter(Boolean));
      const existingGuestIds = new Set(enrichedSessions.map(s => s.guestId).filter(Boolean));
      const existingUserIds = new Set(enrichedSessions.map(s => s.userId?.toString()).filter(Boolean));

      // 1. Ensure all Downloads are included
      downloads.forEach(dl => {
        const hasSession =
          (dl.sessionId && existingSessionIds.has(dl.sessionId)) ||
          (dl.email && existingEmails.has(String(dl.email).toLowerCase())) ||
          (dl.guestId && existingGuestIds.has(dl.guestId));

        if (!hasSession && (dl.email || dl.resumeName || dl.guestId)) {
          const email = cleanEmail(dl.email);
          const resumeName = cleanName(dl.resumeName);
          const entryTime = dl.downloadedAt || dl.createdAt || new Date();
          enrichedSessions.unshift({
            _id: dl._id,
            sessionId: dl.sessionId || `SESSION_${dl._id}`,
            guestId: dl.guestId || null,
            userId: dl.userId || null,
            email,
            resumeName,
            entryTime,
            lastActiveTime: entryTime,
            exitTime: entryTime,
            currentPage: "/builder",
            resumeCreated: true,
            resumeId: dl.resumeId || null,
            downloadType: dl.downloadType || "no_watermark",
            downloaded: true,
            downloadedAt: entryTime,
            status: "exited",
            events: [{ action: "RESUME_DOWNLOADED", page: "/builder", timestamp: entryTime }]
          });
          if (dl.sessionId) existingSessionIds.add(dl.sessionId);
          if (email) existingEmails.add(email.toLowerCase());
          if (dl.guestId) existingGuestIds.add(dl.guestId);
        }
      });

      // 2. Ensure all Payments are included (Paid / Verified customers)
      payments.forEach(p => {
        const pEmail = cleanEmail(p.email);
        const pName = cleanName(p.resumeName);
        const pTime = p.createdAt || p.updatedAt || new Date();

        const hasSession =
          (pEmail && existingEmails.has(pEmail.toLowerCase())) ||
          (p.resumeReference && existingGuestIds.has(p.resumeReference)) ||
          (p.userId && existingUserIds.has(p.userId.toString()));

        if (!hasSession) {
          enrichedSessions.unshift({
            _id: p._id,
            sessionId: `PAYMENT_${p.razorpayOrderId || p._id}`,
            guestId: p.resumeReference || null,
            userId: p.userId || null,
            email: pEmail,
            resumeName: pName || "Customer",
            entryTime: pTime,
            lastActiveTime: pTime,
            exitTime: pTime,
            currentPage: "/plans",
            resumeCreated: true,
            resumeId: p.resumeId || p.resumeReference || null,
            downloadType: p.plan || "no_watermark",
            downloaded: true,
            downloadedAt: pTime,
            status: "exited",
            events: [
              { action: "Payment Completed (₹" + (p.amount || 0) + ")", page: "/plans", timestamp: pTime },
              { action: "RESUME_DOWNLOADED", page: "/builder", timestamp: pTime }
            ]
          });
          if (pEmail) existingEmails.add(pEmail.toLowerCase());
          if (p.resumeReference) existingGuestIds.add(p.resumeReference);
          if (p.userId) existingUserIds.add(p.userId.toString());
        }
      });

      // 3. Ensure all Registered Users are included
      users.forEach(u => {
        const uEmail = cleanEmail(u.email);
        const uName = cleanName(u.name);
        const uTime = u.createdAt || new Date();

        const hasSession =
          (uEmail && existingEmails.has(uEmail.toLowerCase())) ||
          (u.userId && existingGuestIds.has(u.userId)) ||
          (u._id && existingUserIds.has(u._id.toString()));

        if (!hasSession && (uEmail || uName)) {
          enrichedSessions.push({
            _id: u._id,
            sessionId: `USER_${u.userId || u._id}`,
            guestId: u.isGuest ? (u.userId || null) : null,
            userId: u._id,
            email: uEmail,
            resumeName: uName,
            entryTime: uTime,
            lastActiveTime: u.updatedAt || uTime,
            exitTime: u.updatedAt || uTime,
            currentPage: "/",
            resumeCreated: false,
            resumeId: null,
            downloadType: "none",
            downloaded: false,
            downloadedAt: null,
            status: "exited",
            events: [{ action: "User Registered", page: "/", timestamp: uTime }]
          });
          if (uEmail) existingEmails.add(uEmail.toLowerCase());
          if (u._id) existingUserIds.add(u._id.toString());
        }
      });

      // Sort entire list by most recent activity first
      enrichedSessions.sort((a, b) => {
        const timeA = new Date(a.lastActiveTime || a.entryTime || 0).getTime();
        const timeB = new Date(b.lastActiveTime || b.entryTime || 0).getTime();
        return timeB - timeA;
      });

      return res.status(200).json({ success: true, sessions: enrichedSessions });
    } else {
      const sessions = getLocalCollection('userSessions');
      const payments = getLocalCollection('payments');
      const users = getLocalCollection('users');
      const downloads = getLocalCollection('downloads');

      const existingEmails = new Set(sessions.map(s => s.email?.toLowerCase()).filter(Boolean));

      payments.forEach(p => {
        if (p.email && !existingEmails.has(p.email.toLowerCase())) {
          sessions.push({
            _id: p._id || `pmt_${Date.now()}`,
            sessionId: `PAYMENT_${p._id}`,
            email: p.email,
            resumeName: p.resumeName || "Customer",
            entryTime: p.createdAt || new Date().toISOString(),
            lastActiveTime: p.createdAt || new Date().toISOString(),
            exitTime: p.createdAt || new Date().toISOString(),
            currentPage: "/plans",
            resumeCreated: true,
            downloadType: p.plan || "no_watermark",
            downloaded: true,
            status: "exited",
            events: [{ action: "Payment Completed", page: "/plans", timestamp: p.createdAt || new Date().toISOString() }]
          });
          existingEmails.add(p.email.toLowerCase());
        }
      });

      users.forEach(u => {
        if (u.email && !existingEmails.has(u.email.toLowerCase())) {
          sessions.push({
            _id: u._id || `usr_${Date.now()}`,
            sessionId: `USER_${u._id}`,
            email: u.email,
            resumeName: u.name,
            entryTime: u.createdAt || new Date().toISOString(),
            lastActiveTime: u.createdAt || new Date().toISOString(),
            exitTime: u.createdAt || new Date().toISOString(),
            currentPage: "/",
            resumeCreated: false,
            downloadType: "none",
            downloaded: false,
            status: "exited",
            events: [{ action: "User Registered", page: "/", timestamp: u.createdAt || new Date().toISOString() }]
          });
          existingEmails.add(u.email.toLowerCase());
        }
      });

      sessions.sort((a, b) => new Date(b.lastActiveTime || b.entryTime) - new Date(a.lastActiveTime || a.entryTime));
      return res.status(200).json({ success: true, sessions });
    }
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
