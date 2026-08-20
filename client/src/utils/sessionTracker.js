import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getOrCreateUser } from "./userIdentity";

let activeSessionId = null;

const getSessionId = () => {
  if (activeSessionId) return activeSessionId;
  const stored = localStorage.getItem("tracker_session_id");
  if (stored) {
    activeSessionId = stored;
    return stored;
  }
  const newSessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("tracker_session_id", newSessionId);
  activeSessionId = newSessionId;
  return newSessionId;
};

export const startSession = async (currentPage = "/") => {
  try {
    const sessionId = getSessionId();
    const user = await getOrCreateUser();
    
    await axios.post(`${API_BASE_URL}/sessions/start`, {
      sessionId,
      guestId: user.isGuest ? user._id || user.guestId : null,
      userId: !user.isGuest ? user._id : null,
      email: user.email,
      currentPage
    });
    
    // Add beforeunload listener to end session
    window.addEventListener("beforeunload", () => {
      // Use navigator.sendBeacon for reliable delivery on exit
      const data = JSON.stringify({ sessionId });
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(`${API_BASE_URL}/sessions/end`, blob);
    });
  } catch (error) {
    console.error("Session start error:", error);
  }
};

export const trackEvent = async (action, page = window.location.pathname, extraData = {}) => {
  try {
    const sessionId = getSessionId();
    
    if (!sessionId) {
      console.warn("No userSessionId found");
      return;
    }

    await axios.post(`${API_BASE_URL}/sessions/track`, {
      sessionId,
      action,
      page,
      ...(extraData || {})
    });
  } catch (error) {
    console.error("Track event error:", error);
  }
};

export const endSession = async () => {
  try {
    const sessionId = getSessionId();
    await axios.post(`${API_BASE_URL}/sessions/end`, {
      sessionId
    });
    localStorage.removeItem("tracker_session_id");
    activeSessionId = null;
  } catch (error) {
    console.error("End session error:", error);
  }
};
