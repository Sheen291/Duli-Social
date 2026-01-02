import axios from "axios";
import { 
    CREATE_STORY_FAILURE, CREATE_STORY_REQUEST, CREATE_STORY_SUCCESS, 
    GET_HOME_STORY_FAILURE, GET_HOME_STORY_REQUEST, GET_HOME_STORY_SUCCESS, 
    GET_USER_STORY_FAILURE, GET_USER_STORY_REQUEST, GET_USER_STORY_SUCCESS 
} from "./story.actionType";

const API_BASE_URL = "http://localhost:8080";


const getConfig = () => {
    const jwt = localStorage.getItem("jwt");
    return {
        headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" }
    };
};

export const createStoryAction = (storyData) => async(dispatch) => {
    dispatch({type: CREATE_STORY_REQUEST});
    try {
        const {data} = await axios.post(`${API_BASE_URL}/api/stories`, storyData, getConfig());
        console.log("create story success", data);
        dispatch({type: CREATE_STORY_SUCCESS, payload: data});
    } catch (error) {
        console.log("create story fail", error);
        dispatch({type: CREATE_STORY_FAILURE, payload: error});
    }
};

export const getHomeStoryAction = () => async(dispatch) => {
    dispatch({type: GET_HOME_STORY_REQUEST});
    try {
        const {data} = await axios.get(`${API_BASE_URL}/api/stories`, getConfig());
        console.log("get home story success", data);
        dispatch({type: GET_HOME_STORY_SUCCESS, payload: data});
    } catch (error) {
        dispatch({type: GET_HOME_STORY_FAILURE, payload: error});
    }
};

export const getUserStoryAction = (userId) => async(dispatch) => {
    dispatch({type: GET_USER_STORY_REQUEST});
    try {
        const {data} = await axios.get(`${API_BASE_URL}/api/stories/user/${userId}`, getConfig());
        console.log("get user story success", data);
        dispatch({type: GET_USER_STORY_SUCCESS, payload: data});
    } catch (error) {
        dispatch({type: GET_USER_STORY_FAILURE, payload: error});
    }
};