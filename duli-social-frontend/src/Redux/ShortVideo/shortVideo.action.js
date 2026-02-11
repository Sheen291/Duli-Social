import axios from "axios";
import { 
    CREATE_SHORT_VIDEO_FAILURE, CREATE_SHORT_VIDEO_REQUEST, CREATE_SHORT_VIDEO_SUCCESS, 
    GET_ALL_SHORT_VIDEO_FAILURE, GET_ALL_SHORT_VIDEO_REQUEST, GET_ALL_SHORT_VIDEO_SUCCESS, 
    GET_USER_SHORT_VIDEO_FAILURE, GET_USER_SHORT_VIDEO_REQUEST, GET_USER_SHORT_VIDEO_SUCCESS, 
    LIKE_SHORT_VIDEO_FAILURE, LIKE_SHORT_VIDEO_REQUEST, LIKE_SHORT_VIDEO_SUCCESS,
    DELETE_SHORT_VIDEO_REQUEST, DELETE_SHORT_VIDEO_SUCCESS, DELETE_SHORT_VIDEO_FAILURE,
    CREATE_SHORT_VIDEO_COMMENT_FAILURE, CREATE_SHORT_VIDEO_COMMENT_REQUEST, CREATE_SHORT_VIDEO_COMMENT_SUCCESS
} from "./shortVideo.actionType";

const API_BASE_URL = "http://localhost:8080";


const getConfig = () => {
    const jwt = localStorage.getItem("jwt");
    return {
        headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" }
    };
};

export const createShortVideoAction = (reqData) => async(dispatch) => {
    dispatch({type: CREATE_SHORT_VIDEO_REQUEST});
    try {
        const {data} = await axios.post(`${API_BASE_URL}/api/shortvideos/created`, reqData, getConfig());
        console.log("create short video success", data);
        dispatch({type: CREATE_SHORT_VIDEO_SUCCESS, payload: data});
    } catch (error) {
        console.log("create short video fail", error);
        dispatch({type: CREATE_SHORT_VIDEO_FAILURE, payload: error});
    }
};

export const getAllShortVideoAction = (reqData) => async (dispatch) => {
    dispatch({ type: GET_ALL_SHORT_VIDEO_REQUEST });
    try {
        const { page, sessionId } = reqData;

        const { data } = await axios.get(`${API_BASE_URL}/api/shortvideos/feed?page=${page}&sessionId=${sessionId}`, getConfig());
        
        console.log("get reels feed success", data);

        const isLastPage = data.length < 5;

        dispatch({
            type: GET_ALL_SHORT_VIDEO_SUCCESS,
            payload: {
                content: data,
                page: page,
                last: isLastPage
            }
        });
    } catch (error) {
        console.log("get reels error", error);
        dispatch({ type: GET_ALL_SHORT_VIDEO_FAILURE, payload: error });
    }
};

export const getUserShortVideoAction = (userId, page = 0) => async(dispatch) => {
    dispatch({type: GET_USER_SHORT_VIDEO_REQUEST});
    try {
        const {data} = await axios.get(`${API_BASE_URL}/api/shortvideos/user/${userId}?page=${page}&size=5`, getConfig());
        
        dispatch({
            type: GET_USER_SHORT_VIDEO_SUCCESS, 
            payload: { content: data.content, page: page, last: data.last }
        });
    } catch (error) {
        dispatch({type: GET_USER_SHORT_VIDEO_FAILURE, payload: error});
    }
};

export const likeShortVideoAction = (videoId) => async(dispatch) => {
    dispatch({type: LIKE_SHORT_VIDEO_REQUEST});
    try {
        const {data} = await axios.put(`${API_BASE_URL}/api/shortvideos/liked/${videoId}`, {}, getConfig());
        console.log("like short video success", data);
        dispatch({type: LIKE_SHORT_VIDEO_SUCCESS, payload: data});
    } catch (error) {
        console.log("like short video fail", error);
        dispatch({type: LIKE_SHORT_VIDEO_FAILURE, payload: error});
    }
};

export const deleteShortVideoAction = (videoId) => async(dispatch) => {
    dispatch({type: DELETE_SHORT_VIDEO_REQUEST});
    try {
        await axios.delete(`${API_BASE_URL}/api/shortvideos/deleted/${videoId}`, getConfig());
        dispatch({type: DELETE_SHORT_VIDEO_SUCCESS, payload: videoId});
    } catch (error) {
        dispatch({type: DELETE_SHORT_VIDEO_FAILURE, payload: error});
    }
};

export const createShortVideoCommentAction = (reqData) => async(dispatch) => {
    dispatch({type: CREATE_SHORT_VIDEO_COMMENT_REQUEST});
    try {
        const {data} = await axios.post(`${API_BASE_URL}/api/comments/shortvideo/${reqData.shortVideoId}`, reqData.data, getConfig());
        console.log("create short video comment success", data);
        dispatch({type: CREATE_SHORT_VIDEO_COMMENT_SUCCESS, payload: data});
    } catch (error) {
        console.log("create short video comment fail", error);
        dispatch({type: CREATE_SHORT_VIDEO_COMMENT_FAILURE, payload: error});
    }
};
