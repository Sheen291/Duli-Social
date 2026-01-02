import { 
    GET_PROFILE_FAILURE, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, 
    LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, 
    REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, 
    UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_FAILURE, 
    LOG_OUT, 
    SEARCH_USER_SUCCESS, SEARCH_USER_REQUEST, SEARCH_USER_FAILURE,
    GET_USER_BY_ID_SUCCESS, GET_USER_BY_ID_REQUEST, GET_USER_BY_ID_FAILURE,
    LOGIN_GOOGLE_REQUEST, LOGIN_GOOGLE_SUCCESS, LOGIN_GOOGLE_FAILURE,
    FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE
} from "./auth.actionType"

import { SAVE_POST_SUCCESS } from "../Post/post.actionType"

const initialState = {
    jwt: null,
    error: null,
    loading: false,
    user: null,          
    searchUser: [],      
    findUser: null       
}

export const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case LOGIN_REQUEST:
        case LOGIN_GOOGLE_REQUEST:
        case REGISTER_REQUEST:
        case GET_PROFILE_REQUEST:
        case UPDATE_PROFILE_REQUEST:
        case SEARCH_USER_REQUEST:     
        case FOLLOW_USER_REQUEST:      
            return { ...state, loading: true, error: null }

        case GET_USER_BY_ID_REQUEST:
            return { ...state, loading: true, error: null, findUser: null }

        case LOGIN_SUCCESS:
        case LOGIN_GOOGLE_SUCCESS:
        case REGISTER_SUCCESS:
            return { ...state, jwt: action.payload, loading: false, error: null }

        case GET_PROFILE_SUCCESS:
        case UPDATE_PROFILE_SUCCESS:
        case FOLLOW_USER_SUCCESS:
            return { ...state, user: action.payload, error: null, loading: false }

        case SEARCH_USER_SUCCESS:
            return { ...state, searchUser: action.payload, loading: false, error: null }
        
        case GET_USER_BY_ID_SUCCESS:
            return { ...state, findUser: action.payload, loading: false, error: null  }

        case SAVE_POST_SUCCESS:
            const postId = action.payload.id; 
            
            const oldSavedIds = state.user?.savedPostIds || [];
            
            const isSaved = oldSavedIds.includes(postId);
            const newSavedIds = isSaved
                ? oldSavedIds.filter(id => id !== postId)
                : [...oldSavedIds, postId];

            return {
                ...state,
                user: {
                    ...state.user,
                    savedPostIds: newSavedIds
                }
            };

        case LOGIN_FAILURE:
        case LOGIN_GOOGLE_FAILURE:
        case REGISTER_FAILURE:
        case GET_PROFILE_FAILURE:
        case UPDATE_PROFILE_FAILURE:
        case SEARCH_USER_FAILURE:       
        case GET_USER_BY_ID_FAILURE:
        case FOLLOW_USER_FAILURE:       
            return { ...state, loading: false, error: action.payload }

        case LOG_OUT:
            return { ...initialState };

        default:
            return state;
    }
}