import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const createResume = async (userId) => {
  const response = await axios.post(`${API_BASE_URL}/resumes`, {
    userId,
  });

  return response.data;
};
