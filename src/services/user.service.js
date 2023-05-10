import axios from "axios";
import authHeader from "./authHeader";

export const API_URL = "http://62.109.16.15:3000/";
const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";
export const getStrategies = () => {
  return axios.get(API_URL + "getStrategies", { headers: authHeader() });
};
export const delStrategy = (strategy) => {
  return axios.post(
    API_URL + "deleteStrategy",
    { strategy },
    { headers: authHeader() }
  );
};

export const updateProfile = (firstname, lastname, status) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.post(
        API_URL + "updateProfile",
        { firstname, lastname, status },
        { headers: authHeader() }
      );
      const updatedUser = response.data;

      // update currentUser in localStorage
      const { auth } = getState();
      localStorage.setItem(
        "user",
        JSON.stringify({ ...auth.user, ...updatedUser })
      );

      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: {
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          status: updatedUser.status,
        },
      });

      return updatedUser;
    } catch (error) {
      dispatch({
        type: UPDATE_PROFILE_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const postStrategy = (
  name,
  indicators,
  buyConditions,
  sellConditions
) => {
  return axios.post(
    API_URL + "saveStrategy",
    {
      name,
      indicators,
      buyConditions,
      sellConditions,
    },
    { headers: authHeader() }
  );
};
