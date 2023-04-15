import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://92.63.105.48:3000/";

export const getStrategies = () => {
  return axios.get(API_URL + "getStrategies", {headers:authHeader()});
}
export const delStrategy = (strategy) => {
  return axios.post(API_URL + "deleteStrategy", {strategy},{headers: authHeader()})
}

export const postStrategy = (name, indicators, buyConditions, sellConditions) => {
  return axios.post(API_URL + "saveStrategy", {
    name,
    indicators,
    buyConditions,
    sellConditions
  }, { headers: authHeader() });
};

