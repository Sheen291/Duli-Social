import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/auth.reducer";
import { postReducer } from "./Post/post.reducer";
import { messageReducer } from "./Message/message.reducer";
import { shortVideoReducer } from "./ShortVideo/shortVideo.reducer";
import { storyReducer } from "./Story/story.reducer";
import { notificationReducer } from "./Notification/notification.reducer";

const rootReducers = combineReducers({
    post: postReducer,
    auth: authReducer,
    message: messageReducer,
    shortVideo: shortVideoReducer,
    story: storyReducer,
    notification: notificationReducer,
})

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));

