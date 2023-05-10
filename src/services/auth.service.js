import axios from "axios";

const API_URL = "http://62.109.16.15:3000/";

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
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = async () => {
  //const user = await JSON.parse(localStorage.getItem('user'))
  // console.log('user unlogged: ')
  //await axios.post(API_URL + "logout", {});
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  logout,
};
