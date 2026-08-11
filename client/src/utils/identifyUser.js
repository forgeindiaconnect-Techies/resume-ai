import axios from "axios";
import { getAnonymousId } from "./userIdentity";
import { API_BASE_URL } from "../config/api";

export const identifyUser = async (email = "") => {
  const anonymousId = getAnonymousId();

  const response = await axios.post(`${API_BASE_URL}/users/identify`, {
    email,
    anonymousId,
  });

  if (response.data.userId) {
    localStorage.setItem("resume_user_id", response.data.userId);
  }

  if (response.data.token) {
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", response.data.token);
    }
  }

  return response.data;
};
