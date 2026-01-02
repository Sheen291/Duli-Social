import { 
    CREATE_STORY_SUCCESS, CREATE_STORY_REQUEST, CREATE_STORY_FAILURE,
    GET_HOME_STORY_SUCCESS, GET_HOME_STORY_REQUEST, GET_HOME_STORY_FAILURE,
    GET_USER_STORY_SUCCESS, GET_USER_STORY_REQUEST, GET_USER_STORY_FAILURE
} from "./story.actionType";

const initialState = {
    stories: [],      
    userStories: [],  
    loading: false,
    error: null
};

export const storyReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_STORY_REQUEST:
        case GET_HOME_STORY_REQUEST:
        case GET_USER_STORY_REQUEST:
            return { ...state, loading: true, error: null };

        case CREATE_STORY_SUCCESS:
            return {
                ...state,
                loading: false,
                stories: [action.payload, ...state.stories], 
                userStories: [action.payload, ...state.userStories]
            };

        case GET_HOME_STORY_SUCCESS:
            return { ...state, loading: false, stories: action.payload };

        case GET_USER_STORY_SUCCESS:
            return { ...state, loading: false, userStories: action.payload };

        case CREATE_STORY_FAILURE:
        case GET_HOME_STORY_FAILURE:
        case GET_USER_STORY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};