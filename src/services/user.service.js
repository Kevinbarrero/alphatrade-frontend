import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://92.63.105.48:3000/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

export default {
  getPublicContent,
  getUserBoard
};

