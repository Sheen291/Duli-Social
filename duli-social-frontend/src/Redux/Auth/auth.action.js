import axios from "axios";
import { 
    LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
    GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE, GET_PROFILE_REQUEST,
    UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAILURE, 
    LOG_OUT, SEARCH_USER_SUCCESS, SEARCH_USER_REQUEST, SEARCH_USER_FAILURE, 
    GET_USER_BY_ID_REQUEST, GET_USER_BY_ID_SUCCESS, GET_USER_BY_ID_FAILURE,
    LOGIN_GOOGLE_REQUEST, LOGIN_GOOGLE_SUCCESS, LOGIN_GOOGLE_FAILURE,
    FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE
} from "./auth.actionType";

export const API_BASE_URL = "http://localhost:8080";

const getConfig = () => {
  const jwt = localStorage.getItem("jwt");
  return {
    headers: {
      "Authorization": `Bearer ${jwt}`,
      "Content-Type": "application/json"
    }
  };
};

export const loginUserAction = (loginData) => async(dispatch) => {
    dispatch({type: LOGIN_REQUEST})
    try {
        const {data} = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
        
        if (data.token) {
            localStorage.setItem("jwt", data.token);
        }
        
        console.log("login success", data);
        
        dispatch({type: LOGIN_SUCCESS, payload: data.token});

        return data;
        
    } catch (error) {
        console.log("login failure", error);
        const errorMessage = error.response?.data?.message || error.message || "Login failed";
        dispatch({type: LOGIN_FAILURE, payload: errorMessage});
    }
}

export const registerUserAction = (registerData) => async(dispatch) => {
    dispatch({type: REGISTER_REQUEST})
    try {
        const {data} = await axios.post(`${API_BASE_URL}/auth/signup`, registerData);
        
        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
        }
        
        console.log("register success", data)
        dispatch({type: REGISTER_SUCCESS, payload: data.jwt});
        
    } catch (error) {
        console.log("register failure", error);
        const errorMessage = error.response?.data?.message || error.message || "Register failed";
        dispatch({type: REGISTER_FAILURE, payload: errorMessage});
    }
}

export const getProfileAction = (jwt) => async(dispatch) => {
    dispatch({type: GET_PROFILE_REQUEST})
    try {
        const {data} = await axios.get(`${API_BASE_URL}/api/users/profile`,
            {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                },
            });
        
        console.log("get profile success", data)
        dispatch({type: GET_PROFILE_SUCCESS, payload: data});
        
    } catch (error) {
        console.log("get profile failure", error);
        const errorMessage = error.response?.data?.message || error.message || "Get profile failed";
        dispatch({type: GET_PROFILE_FAILURE, payload: errorMessage});
    }
}

export const updateProfileAction = (reqData) => async(dispatch) => {
    dispatch({type: UPDATE_PROFILE_REQUEST})
    try {
        const jwt = localStorage.getItem("jwt");

        const {data} = await axios.put(`${API_BASE_URL}/api/users`, reqData, {
            headers: {
                 "Authorization": `Bearer ${jwt}`,
                 "Content-Type": "application/json"
            }
        });
        console.log("update profile success", data)
        dispatch({type: UPDATE_PROFILE_SUCCESS, payload: data});
    } catch (error) {
        console.log("update profile failure", error);
        dispatch({type: UPDATE_PROFILE_FAILURE, payload: error});
    }
}

export const logoutUserAction = () => (dispatch) => {
    localStorage.removeItem("jwt");
    dispatch({type: LOG_OUT});
    console.log("log out success");
}

export const searchUserAction = (query) => async(dispatch) => {
    dispatch({type: SEARCH_USER_REQUEST});
    try {
        const {data} = await axios.get(`${API_BASE_URL}/api/users/search?query=${query}`, getConfig());
        console.log("search user success", data)
        dispatch({type: SEARCH_USER_SUCCESS, payload: data});
    } catch (error) {
        console.log("search user failure", error);
        dispatch({type: SEARCH_USER_FAILURE, payload: error});
    }
}

export const getUserByIdAction = (userId) => async (dispatch) => {
    dispatch({ type: GET_USER_BY_ID_REQUEST });
    try {
        const {data} = await axios.get(`${API_BASE_URL}/api/users/${userId}`, getConfig());
        console.log('get user by id success', data);

        dispatch({ type: GET_USER_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        console.log('get user by id failure', error);
        dispatch({ type: GET_USER_BY_ID_FAILURE, payload: error });
    }
}

export const loginGoogleAction = (data) => async(dispatch) => {
    dispatch({type: LOGIN_GOOGLE_REQUEST});
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/google`, data); 
        
        if (response.data.jwt) {
            localStorage.setItem("jwt", response.data.jwt);
        }
        
        console.log("login google success", response.data);
        dispatch({type: LOGIN_GOOGLE_SUCCESS, payload: response.data.jwt});
        
    } catch (error) {
        console.log("login google failure", error);
        dispatch({type: LOGIN_GOOGLE_FAILURE, payload: error.message});
    }
};

export const followUserAction = (userId) => async(dispatch) => {
    dispatch({type: FOLLOW_USER_REQUEST});
    try {
        const config = getConfig();
        
        const {data} = await axios.put(`${API_BASE_URL}/api/users/follow/${userId}`, {}, config);
        
        console.log("follow user success", data);
        
        dispatch({type: FOLLOW_USER_SUCCESS, payload: data});
        
    } catch (error) {
        console.log("follow user failure", error);
        dispatch({type: FOLLOW_USER_FAILURE, payload: error.message});
    }
};