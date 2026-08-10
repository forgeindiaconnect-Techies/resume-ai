import axios from "axios";
import { getAnonymousId } from "./userIdentity";

export const identifyUser = async (email = "") => {
  const anonymousId = getAnonymousId();

  const response = await axios.post("http://localhost:5000/api/users/identify", {
    email,
    anonymousId,
  });

  if (response.data.userId) {
    localStorage.setItem("resume_user_id", response.data.userId);
  }

  return response.data;
};
