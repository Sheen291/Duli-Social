import axios from "axios";
import { 
    CREATE_POST_FAILURE, CREATE_POST_REQUEST, CREATE_POST_SUCCESS, 
    LIKE_POST_FAILURE, LIKE_POST_SUCCESS, LIKE_POST_REQUEST, 
    GET_POST_BY_USERID_REQUEST, GET_POST_BY_USERID_SUCCESS, GET_POST_BY_USERID_FAILURE, 
    GET_ALL_POST_REQUEST, GET_ALL_POST_SUCCESS, GET_ALL_POST_FAILURE, 
    CREATE_COMMENT_FAILURE, CREATE_COMMENT_REQUEST, CREATE_COMMENT_SUCCESS,
    SAVE_POST_REQUEST, SAVE_POST_SUCCESS, SAVE_POST_FAILURE,
    DELETE_POST_REQUEST, DELETE_POST_SUCCESS, DELETE_POST_FAILURE,
    GET_SINGLE_POST_REQUEST, GET_SINGLE_POST_SUCCESS, GET_SINGLE_POST_FAILURE,
    LIKE_COMMENT_FAILURE, LIKE_COMMENT_REQUEST, LIKE_COMMENT_SUCCESS,
    GET_USER_SAVED_POST_REQUEST, 
    GET_USER_SAVED_POST_SUCCESS, 
    GET_USER_SAVED_POST_FAILURE,
} from "./post.actionType"

const API_URL = "http://localhost:8080";

const getConfig = () => {
  const token = localStorage.getItem("jwt");
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
}

export const createPostAction = (postData) => async(dispatch) => {
    dispatch({type: CREATE_POST_REQUEST})
    try {
        const {data} = await axios.post(`${API_URL}/api/posts`, postData, getConfig());
        dispatch({type: CREATE_POST_SUCCESS, payload: data});
        console.log("create post success: ", data);
    } catch (error) {
        dispatch({type: CREATE_POST_FAILURE, payload: error})
        console.log("create post fail: ", error);
    }
}

export const getAllPostAction = (page = 0, size = 5) => async(dispatch) => {
    dispatch({type: GET_ALL_POST_REQUEST})
    try {
        const {data} = await axios.get(`${API_URL}/api/posts?page=${page}&size=${size}`, getConfig());
        
        dispatch({
            type: GET_ALL_POST_SUCCESS, 
            payload: { content: data.content, page: page, last: data.last } 
        });
        
        console.log("all post success: ", data);
    } catch (error) {
        dispatch({type: GET_ALL_POST_FAILURE, payload: error})
        console.log("all post fail: ", error);
    }
}

export const getPostByUserIdAction = (userId, page = 0) => async(dispatch) => {
    dispatch({type: GET_POST_BY_USERID_REQUEST})
    try {
        const {data} = await axios.get(`${API_URL}/api/posts/user/${userId}?page=${page}&size=5`, getConfig());
        
        console.log("get post user success: ", data);
        
        dispatch({
            type: GET_POST_BY_USERID_SUCCESS, 
            payload: { content: data.content, page: page, last: data.last } 
        });
        
    } catch (error) {
        dispatch({type: GET_POST_BY_USERID_FAILURE, payload: error})
        console.log("get user post fail: ", error);
    }
}

export const likePostAction = (postId) => async(dispatch) => {
    dispatch({type: LIKE_POST_REQUEST})
    try {
        const { data } = await axios.put(`${API_URL}/api/posts/like/${postId}`, {}, getConfig());
        dispatch({type: LIKE_POST_SUCCESS, payload: data});
        console.log("like post success: ", data);
    } catch (error) {
        dispatch({type: LIKE_POST_FAILURE, payload: error})
        console.log("like post fail: ", error);
    }
}

export const savePostAction = (postId) => async(dispatch) => {
    dispatch({type: SAVE_POST_REQUEST})
    try {
        const { data } = await axios.put(`${API_URL}/api/posts/saved/${postId}`, {}, getConfig());
        dispatch({type: SAVE_POST_SUCCESS, payload: data});
        console.log("save post success: ", data);
    } catch (error) {
        dispatch({type: SAVE_POST_FAILURE, payload: error})
        console.log("save post fail: ", error);
    }
}

export const deletePostAction = (postId) => async(dispatch) => {
    dispatch({type: DELETE_POST_REQUEST})
    try {
        const { data } = await axios.delete(`${API_URL}/api/posts/${postId}`, getConfig());
        dispatch({type: DELETE_POST_SUCCESS, payload: postId});
        console.log("delete post success: ", data);
    } catch (error) {
        dispatch({type: DELETE_POST_FAILURE, payload: error})
        console.log("delete post fail: ", error);
    }
}

export const getSinglePostAction = (postId) => async(dispatch) => {
    dispatch({type: GET_SINGLE_POST_REQUEST})
    try {
        const { data } = await axios.get(`${API_URL}/api/posts/${postId}`, getConfig());
        dispatch({type: GET_SINGLE_POST_SUCCESS, payload: data});
    } catch (error) {
        dispatch({type: GET_SINGLE_POST_FAILURE, payload: error})
    }
}

export const createCommentAction = (reqData) => async(dispatch) => {
    dispatch({type: CREATE_COMMENT_REQUEST})
    try {
        const {data} = await axios.post(`${API_URL}/api/comments/post/${reqData.postId}`, reqData.data, getConfig());
        
        const payloadData = { ...data, postId: reqData.postId }; 
        
        dispatch({type: CREATE_COMMENT_SUCCESS, payload: payloadData});
        console.log("create comment success: ", data);
    } catch (error) {
        dispatch({type: CREATE_COMMENT_FAILURE, payload: error})
        console.log("create comment fail: ", error);
    }
}

export const likeCommentAction = (commentId) => async(dispatch) => {
    dispatch({type: LIKE_COMMENT_REQUEST});
    try {
        const { data } = await axios.put(`${API_URL}/api/comments/liked/${commentId}`, {}, getConfig());
        console.log("like comment success", data);
        dispatch({type: LIKE_COMMENT_SUCCESS, payload: data});
    } catch (error) {
        console.log("like comment fail", error);
        dispatch({type: LIKE_COMMENT_FAILURE, payload: error});
    }
};

export const getUsersSavedPostsAction = () => async (dispatch) => {
    dispatch({ type: GET_USER_SAVED_POST_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const config = {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            }
        };
        
        const { data } = await axios.get(`${API_URL}/api/users/saved-posts`, config);
        
        console.log("get saved posts success", data);
        
        dispatch({
            type: GET_USER_SAVED_POST_SUCCESS,
            payload: data
        });
        
    } catch (error) {
        console.log("get saved posts error", error);
        dispatch({
            type: GET_USER_SAVED_POST_FAILURE,
            payload: error
        });
    }
};