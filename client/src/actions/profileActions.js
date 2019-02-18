import axios from "axios";

import { GET_PROFILE, LOADING_PROFILE, GET_ERRORS } from "./types";

// get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// loading profile
export const setProfileLoading = () => ({
  type: LOADING_PROFILE
});
