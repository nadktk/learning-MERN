import { GET_ERRORS, SET_CURRENT_USER } from "./types";

import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

// register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("api/user/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// login and get user token
export const loginUser = userData => dispatch => {
  axios
    .post("api/user/login", userData)
    .then(res => {
      // save token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // set token to auth header
      setAuthToken(token);

      // decode token to get user data
      const decoded = jwt_decode(token);

      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// set logged in user
export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});
