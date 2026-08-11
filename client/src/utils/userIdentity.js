import { createGuestUser } from "../services/userService";

export const getAnonymousId = () => {
  let anonymousId = localStorage.getItem("resume_anonymous_id");

  if (!anonymousId) {
    anonymousId = crypto.randomUUID();
    localStorage.setItem("resume_anonymous_id", anonymousId);
  }

  return anonymousId;
};

export const getOrCreateUser = async () => {
  try {
    // Check if user already exists in this browser AND has a token
    const existingUserId = localStorage.getItem("resume_user_id");
    const existingToken = localStorage.getItem("token");

    if (existingUserId && existingToken) {
      return {
        userId: existingUserId,
        isGuest: true,
      };
    }

    // Create a new guest user
    const response = await createGuestUser();
    const userId = response.user.userId;
    const token = response.token;

    // Save user ID and token in browser
    localStorage.setItem("resume_user_id", userId);
    if (token) {
      localStorage.setItem("token", token);
    }

    return response.user;
  } catch (error) {
    console.error("User identification failed:", error);
    throw error;
  }
};
