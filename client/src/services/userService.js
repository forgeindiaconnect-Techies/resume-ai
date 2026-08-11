import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const createGuestUser = async () => {
  const response = await axios.post(`${API_BASE_URL}/users/guest`);
  return response.data;
};
