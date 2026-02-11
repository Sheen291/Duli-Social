import { 
    GET_PROFILE_FAILURE, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, 
    LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, 
    REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, 
    UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_FAILURE, 
    LOG_OUT, 
    SEARCH_USER_SUCCESS, SEARCH_USER_REQUEST, SEARCH_USER_FAILURE,
    GET_USER_BY_ID_SUCCESS, GET_USER_BY_ID_REQUEST, GET_USER_BY_ID_FAILURE,
    LOGIN_GOOGLE_REQUEST, LOGIN_GOOGLE_SUCCESS, LOGIN_GOOGLE_FAILURE,
    FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE,
    SEARCH_POST_REQUEST, SEARCH_POST_SUCCESS, SEARCH_POST_FAILURE,
    SEARCH_REELS_REQUEST, SEARCH_REELS_SUCCESS, SEARCH_REELS_FAILURE,
    GET_POPULAR_USER_SUCCESS,
    CLEAR_SEARCH_RESULTS
} from "./auth.actionType"

import { SAVE_POST_SUCCESS } from "../Post/post.actionType"

const initialState = {
    jwt: null,
    error: null,
    loading: false,
    user: null,          
    searchUser: [],      
    searchPost: [],   
    searchReels: [],  
    popularUsers: [],
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
        case GET_USER_BY_ID_REQUEST:
        case SEARCH_POST_REQUEST:
        case SEARCH_REELS_REQUEST:
            return { ...state, loading: true, error: null }

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
        
        case SEARCH_POST_SUCCESS:
            return { ...state, searchPost: action.payload, loading: false, error: null }

        case SEARCH_REELS_SUCCESS:
            console.log("REDUCER ĐÃ NHẬN ĐƯỢC DATA:", action.payload);
            return { ...state, searchReels: action.payload, loading: false, error: null }

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

        case GET_POPULAR_USER_SUCCESS:
            return { ...state, 
                    popularUsers: action.payload, 
                    loading: false, 
                    error: null };

        case LOGIN_FAILURE:
        case LOGIN_GOOGLE_FAILURE:
        case REGISTER_FAILURE:
        case GET_PROFILE_FAILURE:
        case UPDATE_PROFILE_FAILURE:
        case SEARCH_USER_FAILURE:       
        case GET_USER_BY_ID_FAILURE:
        case FOLLOW_USER_FAILURE:
        case SEARCH_POST_FAILURE:
        case SEARCH_REELS_FAILURE:      
            return { ...state, loading: false, error: action.payload }

        case LOG_OUT:
            return { ...initialState };
        
        case CLEAR_SEARCH_RESULTS:
            return { 
                ...state, 
                searchUser: [], 
                searchPost: [], 
                searchReels: [] 
            };

        default:
            return state;
    }
}