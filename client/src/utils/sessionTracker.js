import { API_BASE_URL } from "../config/api";

// CREATE / GET ONE WEBSITE SESSION ID
export const getUserSessionId = () => {
  let sessionId = localStorage.getItem("userSessionId");

  if (!sessionId) {
    sessionId = `SESSION_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem("userSessionId", sessionId);
  }

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

const getStoredUserInfo = () => {
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
        currentPage: window.location.pathname
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
