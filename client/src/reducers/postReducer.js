import {
  LOADING_POST,
  GET_POSTS,
  GET_POST,
  ADD_POST,
  DELETE_POST
} from "../actions/types";

const initialState = {
  posts: [],
  post: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case DELETE_POST:
      return state;
    // return {
    //   ...state,
    //   posts: state.posts.filter(post => post._id !== action.payload)
    // };
    case LOADING_POST:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
