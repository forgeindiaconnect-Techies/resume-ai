import { API_BASE_URL } from "../config/api";

// CREATE / GET ONE WEBSITE SESSION ID (Refreshes per visit/30m inactivity)
export const getUserSessionId = () => {
  let sessionId = localStorage.getItem("userSessionId");
  const lastActiveStr = localStorage.getItem("userSessionLastActive");
  const now = Date.now();

  if (!sessionId || !lastActiveStr || (now - parseInt(lastActiveStr, 10) > 30 * 60 * 1000)) {
    sessionId = `SESSION_${now}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem("userSessionId", sessionId);
  }

  localStorage.setItem("userSessionLastActive", now.toString());
  return sessionId;
};

// CREATE / GET ONE GUEST ID
export const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");

  if (!guestId) {
    guestId = `GUEST_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem("guestId", guestId);
  }

  return guestId;
};

export const getStoredUserInfo = () => {
  try {
    const email = localStorage.getItem("userEmail") || null;
    let resumeName = localStorage.getItem("userName") || null;

    const draftRaw = localStorage.getItem("localResumeDraft");
    if (draftRaw) {
      const draft = JSON.parse(draftRaw);
      const name = draft?.personalInfo?.name || draft?.name;
      const mail = draft?.personalInfo?.email || draft?.email;
      if (
        name &&
        name !== "Your Name" &&
        name !== "Guest" &&
        name.toLowerCase() !== "user"
      ) {
        resumeName = name;
      }
      if (
        mail &&
        !mail.includes("example.com") &&
        !mail.includes("guest.local")
      ) {
        return { resumeName, email: mail };
      }
    }

    return { resumeName, email };
  } catch (e) {
    return { resumeName: null, email: null };
  }
};

// Format time in 12-hour AM/PM format (e.g., "1:00 AM" or "4:25 PM")
export const formatExactTime = (dateInput, includeSeconds = false) => {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    ...(includeSeconds ? { second: "2-digit" } : {}),
    hour12: true
  });
};

// Format full date and time (e.g., "Aug 27, 2026, 1:00 PM")
export const formatExactDateTime = (dateInput, includeSeconds = false) => {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const timeStr = formatExactTime(date, includeSeconds);
  return `${dateStr}, ${timeStr}`;
};

// START WEBSITE SESSION
export const startSession = async () => {
  try {
    const sessionId = getUserSessionId();
    const guestId = getGuestId();
    const { resumeName, email } = getStoredUserInfo();

    const response = await fetch(`${API_BASE_URL}/sessions/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sessionId,
        guestId,
        resumeName,
        email,
        currentPage: window.location.pathname,
        timestamp: new Date().toISOString()
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("SESSION START ERROR:", error);
  }
};

// TRACK USER ACTIVITY
export const trackEvent = async (
  action,
  page = window.location.pathname,
  extra = {}
) => {
  try {
    const sessionId = getUserSessionId();
    const guestId = getGuestId();
    const stored = getStoredUserInfo();

    const payload = {
      sessionId,
      guestId,
      action,
      page,
      resumeName: extra.resumeName || stored.resumeName || null,
      email: extra.email || stored.email || null,
      timestamp: new Date().toISOString(),
      ...extra
    };

    const response = await fetch(`${API_BASE_URL}/sessions/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("TRACK EVENT ERROR:", error);
  }
};

// END SESSION (Called when user exits or leaves site)
export const endSession = async () => {
  try {
    const sessionId = localStorage.getItem("userSessionId");
    if (!sessionId) return;

    const payload = JSON.stringify({
      sessionId,
      timestamp: new Date().toISOString()
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(`${API_BASE_URL}/sessions/end`, blob);
    } else {
      await fetch(`${API_BASE_URL}/sessions/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true
      });
    }
  } catch (e) {
    // Non-blocking
  }
};

// Automatic tab/window close listeners
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    endSession();
  });
  window.addEventListener("pagehide", () => {
    endSession();
  });
}
