import { 
    CREATE_COMMENT_SUCCESS, CREATE_COMMENT_REQUEST, CREATE_COMMENT_FAILURE, 
    CREATE_POST_FAILURE, CREATE_POST_REQUEST, CREATE_POST_SUCCESS, 
    GET_ALL_POST_FAILURE, GET_ALL_POST_REQUEST, GET_ALL_POST_SUCCESS, 
    LIKE_POST_FAILURE, LIKE_POST_REQUEST, LIKE_POST_SUCCESS, 
    GET_POST_BY_USERID_REQUEST, GET_POST_BY_USERID_SUCCESS, GET_POST_BY_USERID_FAILURE,
    SAVE_POST_REQUEST, SAVE_POST_SUCCESS, SAVE_POST_FAILURE,
    DELETE_POST_REQUEST, DELETE_POST_SUCCESS, DELETE_POST_FAILURE,
    GET_SINGLE_POST_REQUEST, GET_SINGLE_POST_SUCCESS, GET_SINGLE_POST_FAILURE, 
    LIKE_COMMENT_FAILURE, LIKE_COMMENT_REQUEST, LIKE_COMMENT_SUCCESS,
    GET_USER_SAVED_POST_REQUEST, 
    GET_USER_SAVED_POST_SUCCESS, 
    GET_USER_SAVED_POST_FAILURE,
} from "./post.actionType"

const initialState = {
    posts: [],      
    profilePosts: [],
    loading: false,
    error: null,
    savedPosts: [],
    comments: [],
    commentCreated: false,
    post: null,
    lastPage: false,
}

export const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_POST_REQUEST:
        case GET_ALL_POST_REQUEST:
        case LIKE_POST_REQUEST:
        case CREATE_COMMENT_REQUEST:
        case LIKE_COMMENT_REQUEST:
        case SAVE_POST_REQUEST:
        case DELETE_POST_REQUEST:
        case GET_SINGLE_POST_REQUEST:
            return { ...state, error: null, loading: true }

        case GET_USER_SAVED_POST_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_POST_BY_USERID_REQUEST:
            return { ...state, loading: true, error: null, profilePosts: [] }

        case GET_USER_SAVED_POST_SUCCESS:
            return {
                ...state,
                savedPosts: action.payload,
                loading: false,
                error: null
            };

        case CREATE_POST_SUCCESS:
            return { 
                ...state, 
                error: null, 
                loading: false, 
                posts: [action.payload, ...state.posts],
                profilePosts: [action.payload, ...state.profilePosts] 
            };
        
        case GET_ALL_POST_SUCCESS:
            return { 
                ...state, 
                error: null, 
                loading: false, 
                posts: action.payload.page === 0 
                    ? action.payload.content 
                    : [...state.posts, ...action.payload.content],
                
                commentCreated: false,
                lastPage: action.payload.last
            };
        
        case GET_POST_BY_USERID_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                error: null,
                profilePosts: action.payload.page === 0 
                    ? action.payload.content 
                    : [...state.profilePosts, ...action.payload.content],
                lastPage: action.payload.last
            };

        case LIKE_POST_SUCCESS:
        case SAVE_POST_SUCCESS:
            return {
                ...state,
                error: null,
                loading: false,
                posts: state.posts.map((item) => item.id === action.payload.id ? action.payload : item),
                profilePosts: state.profilePosts.map((item) => item.id === action.payload.id ? action.payload : item)
            }
        
        case DELETE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                posts: state.posts.filter((item) => item.id !== action.payload),
                profilePosts: state.profilePosts.filter((item) => item.id !== action.payload)
            }

        case GET_SINGLE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                post: action.payload
            }

        case CREATE_COMMENT_SUCCESS:            
            const updatedPostsComment = state.posts.map((post) => {
                 if (post.id === action.payload.postId) { 
                    return {
                        ...post,
                        comments: [...(post.comments || []), action.payload],
                        totalComments: (post.totalComments || 0) + 1 
                    };
                }
                return post;
            });

            const updatedProfilePostsComment = state.profilePosts.map((post) => {
                if (post.id === action.payload.postId) {
                    return {
                        ...post,
                        comments: [...(post.comments || []), action.payload],
                        totalComments: (post.totalComments || 0) + 1
                    };
                }
                return post;
            });

            return {
                ...state,
                comments: [action.payload, ...state.comments],
                posts: updatedPostsComment,
                profilePosts: updatedProfilePostsComment,
                loading: false,
                error: null,
                commentCreated: true,
            };

        case LIKE_COMMENT_SUCCESS:
            const updatedPostsLikeComment = state.posts.map(post => {
                if (post.comments && post.comments.some(c => c.id === action.payload.id)) {
                    return {
                        ...post,
                        comments: post.comments.map(comment => 
                            comment.id === action.payload.id ? action.payload : comment
                        )
                    };
                }
                return post;
            });

            const updatedProfilePostsLikeComment = state.profilePosts.map(post => {
                 if (post.comments && post.comments.some(c => c.id === action.payload.id)) {
                    return {
                        ...post,
                        comments: post.comments.map(comment => 
                            comment.id === action.payload.id ? action.payload : comment
                        )
                    };
                }
                return post;
            });

            return {
                ...state,
                comments: state.comments.map(comment => 
                    comment.id === action.payload.id ? action.payload : comment
                ),
                posts: updatedPostsLikeComment,
                profilePosts: updatedProfilePostsLikeComment,
                loading: false,
                error: null
            };

        case GET_USER_SAVED_POST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case CREATE_POST_FAILURE:
        case GET_ALL_POST_FAILURE:
        case LIKE_POST_FAILURE:
        case GET_POST_BY_USERID_FAILURE:
        case CREATE_COMMENT_FAILURE:
        case LIKE_COMMENT_FAILURE:
        case SAVE_POST_FAILURE:
        case DELETE_POST_FAILURE:
        case GET_SINGLE_POST_FAILURE:
            return { ...state, error: action.payload, loading: false }

        default:
            return state;
    }
}