import { 
    CREATE_CHAT_SUCCESS, CREATE_MESSAGE_SUCCESS, 
    GET_ALL_CHAT_SUCCESS, 
    GET_ALL_MESSAGE_SUCCESS, GET_ALL_MESSAGE_REQUEST, GET_ALL_MESSAGE_FAILURE, MARK_MESSAGE_READ
} from "./message.actionType"

const initialState = {
    messages: [], 
    chats: [],    
    loading: false,
    error: null,
    message: null
}

export const messageReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_ALL_MESSAGE_REQUEST:
            return { 
                ...state, 
                loading: true, 
                error: null 
            };
        
        case CREATE_MESSAGE_SUCCESS:
            
            let newMessage = action.payload;
            let currentChatIdFromPayload = null;

            if (action.payload.message) {
                newMessage = action.payload.message;
                currentChatIdFromPayload = action.payload.currentChatId;
            }

            if (!newMessage.chat && currentChatIdFromPayload) {
                newMessage.chat = { id: currentChatIdFromPayload };
            }

            const chatIndex = state.chats.findIndex(chat => chat.id === newMessage.chat?.id);
            let newChatsList = [...state.chats];

            if (chatIndex !== -1) {
                const chatToMove = { ...newChatsList[chatIndex] };
                chatToMove.messages = [...(chatToMove.messages || []), newMessage];
                newChatsList.splice(chatIndex, 1);
                newChatsList.unshift(chatToMove);
            } 
            else if (newMessage.chat) {
                 const newChat = { ...newMessage.chat, messages: [newMessage] };
                 newChatsList.unshift(newChat);
            }

            let updatedMessagesList = state.messages;
            
            const currentOpenChatId = state.messages.length > 0 ? state.messages[0].chat.id : null;
            
            const shouldShowMessage = 
                (currentChatIdFromPayload && currentChatIdFromPayload === newMessage.chat?.id) ||
                (currentOpenChatId === newMessage.chat?.id) ||
                (currentOpenChatId === null && currentChatIdFromPayload);

            if (shouldShowMessage) {
                const isExist = state.messages.find(msg => msg.id === newMessage.id);
                if (!isExist) {
                    updatedMessagesList = [...state.messages, newMessage];
                }
            }

            return {
                ...state,
                message: newMessage,
                chats: newChatsList,
                messages: updatedMessagesList
            };

        case CREATE_CHAT_SUCCESS:
            return {
                ...state,
                chats: [action.payload, ...state.chats]
            }
        
        case GET_ALL_CHAT_SUCCESS:
            return { ...state, chats: action.payload }

        case GET_ALL_MESSAGE_SUCCESS:
            const { messages, page } = action.payload;
            
            const reversedMessages = [...messages].reverse();

            let newMessagesList;
            
            if (page === 0) {
                newMessagesList = reversedMessages;
            } else {
                newMessagesList = [...reversedMessages, ...state.messages];
            }

            return { 
                ...state, 
                messages: newMessagesList,
                loading: false,
                error: null
            };

        case MARK_MESSAGE_READ:
            const { chatId, messages: updatedMessages } = action.payload;
            
            const updatedChatsRead = state.chats.map(chat => {
                if (chat.id == chatId) {
                    const newChatMessages = chat.messages.map(msg => {
                        const foundUpdatedMsg = updatedMessages.find(u => u.id === msg.id);
                        return foundUpdatedMsg ? foundUpdatedMsg : msg;
                    });
                    return { ...chat, messages: newChatMessages };
                }
                return chat;
            });

            return {
                ...state,
                chats: updatedChatsRead
            };

        case GET_ALL_MESSAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
}