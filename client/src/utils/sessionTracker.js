const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


// CREATE / GET ONE WEBSITE SESSION ID
export const getUserSessionId = () => {
  let sessionId = localStorage.getItem("userSessionId");

  if (!sessionId) {
    sessionId =
      `SESSION_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    localStorage.setItem(
      "userSessionId",
      sessionId
    );
  }

  return sessionId;
};


// CREATE / GET ONE GUEST ID
export const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");

  if (!guestId) {
    guestId =
      `GUEST_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    localStorage.setItem(
      "guestId",
      guestId
    );
  }

  return guestId;
};


// START WEBSITE SESSION
export const startSession = async () => {
  try {
    const sessionId = getUserSessionId();
    const guestId = getGuestId();

    const response = await fetch(
      `${API_BASE_URL}/sessions/start`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          sessionId,
          guestId,
          currentPage: window.location.pathname
        })
      }
    );

    const data = await response.json();

    console.log(
      "SESSION START RESULT:",
      data
    );

    return data;

  } catch (error) {
    console.error(
      "SESSION START ERROR:",
      error
    );
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

    // Make sure session exists first
    await startSession();

    const response = await fetch(
      `${API_BASE_URL}/sessions/track`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          sessionId,
          guestId,
          action,
          page,
          ...extra
        })
      }
    );

    const data = await response.json();

    console.log(
      "TRACK EVENT RESULT:",
      action,
      data
    );

    return data;

  } catch (error) {
    console.error(
      "TRACK EVENT ERROR:",
      error
    );
  }
};
