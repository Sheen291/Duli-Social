import axios from "axios";
import { 
    GET_NOTIFICATIONS_FAILURE, GET_NOTIFICATIONS_REQUEST, GET_NOTIFICATIONS_SUCCESS 
} from "./notification.actionType";

const API_BASE_URL = "http://localhost:8080";


const getConfig = () => {
    const jwt = localStorage.getItem("jwt");
    return {
        headers: { Authorization: `Bearer ${jwt}` }
    };
};

export const getNotificationsAction = () => async(dispatch) => {
    dispatch({type: GET_NOTIFICATIONS_REQUEST});
    try {
        const jwt = localStorage.getItem("jwt");
        const {data} = await axios.get(`${API_BASE_URL}/api/notifications`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        
        console.log("Noti data loaded:", data);
        dispatch({type: GET_NOTIFICATIONS_SUCCESS, payload: data});
    } catch (error) {
        console.log("Error loading noti:", error);
        dispatch({type: GET_NOTIFICATIONS_FAILURE, payload: error});
    }
};