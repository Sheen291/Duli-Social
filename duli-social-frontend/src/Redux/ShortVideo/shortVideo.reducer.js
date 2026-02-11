import { 
    CREATE_SHORT_VIDEO_SUCCESS, CREATE_SHORT_VIDEO_REQUEST, CREATE_SHORT_VIDEO_FAILURE,
    GET_ALL_SHORT_VIDEO_SUCCESS, GET_ALL_SHORT_VIDEO_REQUEST, GET_ALL_SHORT_VIDEO_FAILURE,
    GET_USER_SHORT_VIDEO_SUCCESS, GET_USER_SHORT_VIDEO_REQUEST, GET_USER_SHORT_VIDEO_FAILURE,
    LIKE_SHORT_VIDEO_SUCCESS, LIKE_SHORT_VIDEO_FAILURE, LIKE_SHORT_VIDEO_REQUEST,
    DELETE_SHORT_VIDEO_SUCCESS, CREATE_SHORT_VIDEO_COMMENT_SUCCESS
} from "./shortVideo.actionType";

const initialState = {
    shortVideos: [],
    userShortVideos: [],
    loading: false,
    error: null,
    newVideo: null,
    currentVideoComments: [],
    lastPage: false
};

export const shortVideoReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SHORT_VIDEO_REQUEST:
        case GET_ALL_SHORT_VIDEO_REQUEST:
        case GET_USER_SHORT_VIDEO_REQUEST:
        case LIKE_SHORT_VIDEO_REQUEST:
            return { ...state, loading: true, error: null };

        case CREATE_SHORT_VIDEO_SUCCESS:
            return {
                ...state,
                loading: false,
                shortVideos: [action.payload, ...state.shortVideos],
                newVideo: action.payload
            };

        case GET_ALL_SHORT_VIDEO_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                shortVideos: action.payload.page === 0 
                    ? action.payload.content 
                    : [
                        ...state.shortVideos, 
                        ...action.payload.content.filter(newVideo => 
                            !state.shortVideos.some(existingVideo => existingVideo.id === newVideo.id)
                        )
                    ],
                lastPage: action.payload.last
            };

        case GET_USER_SHORT_VIDEO_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                userShortVideos: action.payload.page === 0 
                    ? action.payload.content 
                    : [...state.userShortVideos, ...action.payload.content],
                lastPage: action.payload.last
            };

        case LIKE_SHORT_VIDEO_SUCCESS:
            return {
                ...state,
                loading: false,
                shortVideos: state.shortVideos.map(video => video.id === action.payload.id ? action.payload : video),
                userShortVideos: state.userShortVideos.map(video => video.id === action.payload.id ? action.payload : video)
            };

        case DELETE_SHORT_VIDEO_SUCCESS:
            return {
                ...state,
                loading: false,
                shortVideos: state.shortVideos.filter(video => video.id !== action.payload),
                userShortVideos: state.userShortVideos.filter(video => video.id !== action.payload)
            };

        case CREATE_SHORT_VIDEO_COMMENT_SUCCESS:
            
            return {
                ...state,
                loading: false,
                
                currentVideoComments: [action.payload, ...state.currentVideoComments],

                shortVideos: state.shortVideos.map(video => {
                    const commentVideoId = action.payload.shortVideoId || action.payload.shortVideo?.id;
                    
                    console.log(commentVideoId)
                    if (video.id === commentVideoId) {
                        return {
                            ...video,
                            totalComments: (video.totalComments || 0) + 1,
                            comments: [action.payload, ...(video.comments || [])]
                        };
                    }
                    return video;
                }),

                userShortVideos: state.userShortVideos.map(video => {
                    const commentVideoId = action.payload.shortVideoId || action.payload.shortVideo?.id;
                    if (video.id === commentVideoId) {
                         return {
                            ...video,
                            totalComments: video.totalComments + 1,
                            comments: [action.payload, ...(video.comments || [])]
                        };
                    }
                    return video;
                })
            };

        case CREATE_SHORT_VIDEO_FAILURE:
        case GET_ALL_SHORT_VIDEO_FAILURE:
        case GET_USER_SHORT_VIDEO_FAILURE:
        case LIKE_SHORT_VIDEO_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};