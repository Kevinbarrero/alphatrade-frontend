import axios from "axios";

const API_URL = "http://92.63.105.48:3001/";

const register = (firstname, lastname, email, password) => {
  
  return axios.post(API_URL + "register", {
    firstname,
    lastname,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      console.log(response.data)
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  logout,
};
