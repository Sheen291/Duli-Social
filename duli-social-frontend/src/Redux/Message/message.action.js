// 1. Thêm các import còn thiếu cho getAllMessages
import { 
    CREATE_CHAT_REQUEST, CREATE_CHAT_SUCCESS, CREATE_CHAT_FAILURE,
    CREATE_MESSAGE_REQUEST, CREATE_MESSAGE_SUCCESS, CREATE_MESSAGE_FAILURE, 
    GET_ALL_CHAT_REQUEST, GET_ALL_CHAT_SUCCESS, GET_ALL_CHAT_FAILURE,
    GET_ALL_MESSAGE_REQUEST, GET_ALL_MESSAGE_SUCCESS, GET_ALL_MESSAGE_FAILURE,
    MARK_MESSAGE_READ,
} from "./message.actionType"
import axios from "axios"

const API_URL = "http://localhost:8080";

export const createMessage = (reqData) => async(dispatch) => {
    dispatch({ type: CREATE_MESSAGE_REQUEST })
    try {
        const {message, chatId} = reqData;
        const jwt = localStorage.getItem("jwt");
        const config = {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        };

        const { data } = await axios.post(`${API_URL}/api/messages/chat/${chatId}`, message, config);
        console.log('create message success', data);

        // --- MỞ COMMENT ĐỂ TEST UI TRƯỚC (Optimistic UI) ---
        // Khi Socket chạy ngon thì có thể comment lại để tránh duplicate nếu reducer không handle trùng
        dispatch({
            type: CREATE_MESSAGE_SUCCESS, 
            payload: data 
        });

    } catch (error) {
        console.log("created message failed:", error)
        dispatch({
            type: CREATE_MESSAGE_FAILURE,
            payload: error
        })
    }
}

export const createChat = (chatData) => async(dispatch) => {
    dispatch({ type: CREATE_CHAT_REQUEST })
    try {
        const jwt = localStorage.getItem("jwt"); 
        if (!jwt) throw new Error("No token found");

        const config = {
            headers: { 
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        };

        const { data } = await axios.post(`${API_URL}/api/chats`, chatData, config);
        console.log("Create chat success:", data);

        dispatch({
            type: CREATE_CHAT_SUCCESS,
            payload: data
        });
    } catch (error) {
        console.log("Create chat failed:", error);
        dispatch({
            type: CREATE_CHAT_FAILURE,
            payload: error
        })
    }
}

export const getAllChats = () => async(dispatch) => {
    dispatch({ type: GET_ALL_CHAT_REQUEST })
    try {
        const jwt = localStorage.getItem("jwt");
        const config = {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            }
        };

        const {data} = await axios.get(`${API_URL}/api/chats`, config);
        console.log("get all chat success ", data);

        dispatch({
            type: GET_ALL_CHAT_SUCCESS,
            payload: data
        });
        
    } catch (error) {
        console.log("get all chats failed:", error)
        dispatch({
            type: GET_ALL_CHAT_FAILURE,
            payload: error
        })
    }
}

export const getAllMessages = (chatId, page = 0) => async(dispatch) => {
    if(page === 0) dispatch({ type: GET_ALL_MESSAGE_REQUEST }); 
    
    try {
        const jwt = localStorage.getItem("jwt");
        const config = {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            }
        };

        const {data} = await axios.get(`${API_URL}/api/messages/chat/${chatId}?page=${page}&size=20`, config);
        
        if (page > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log(`Get messages page ${page} success:`, data);
        
        dispatch({ 
            type: GET_ALL_MESSAGE_SUCCESS, 
            payload: {
                messages: data, 
                page: page,     
                chatId: chatId  
            } 
        });

    } catch (error) {
        console.log("get all messages failed:", error)
        dispatch({ type: GET_ALL_MESSAGE_FAILURE, payload: error })
    }
}

export const markMessageRead = (chatId) => async (dispatch) => {
    try {
        const jwt = localStorage.getItem("jwt");
        const config = {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        };

        const { data } = await axios.put(`${API_URL}/api/messages/${chatId}/read`, {}, config);

        console.log("Mark read success:", data);

        dispatch({
            type: MARK_MESSAGE_READ,
            payload: { 
                chatId, 
                messages: data
            }
        });

    } catch (error) {
        console.log("mark message read error:", error);
    }
};