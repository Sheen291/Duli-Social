import { 
    GET_NOTIFICATIONS_SUCCESS, GET_NOTIFICATIONS_REQUEST, GET_NOTIFICATIONS_FAILURE, 
    NEW_NOTIFICATION_RECEIVED 
} from "./notification.actionType";

const initialState = {
    notifications: [],
    loading: false,
    error: null
};

export const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_NOTIFICATIONS_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_NOTIFICATIONS_SUCCESS:
            return { ...state, loading: false, notifications: action.payload };

        case NEW_NOTIFICATION_RECEIVED:
            return { 
                ...state, 
                notifications: [action.payload, ...state.notifications] 
            };

        case GET_NOTIFICATIONS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};