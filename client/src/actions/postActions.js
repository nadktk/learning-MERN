import axios from "axios";
import {
  LOADING_POST,
  GET_POSTS,
  GET_POST,
  ADD_POST,
  DELETE_POST,
  GET_ERRORS
} from "../actions/types";

// add post
export const addPost = postData => dispatch => {
  axios
    .post("api/posts", postData)
    .then(res => {
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
      dispatch({
        type: ADD_POST,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
