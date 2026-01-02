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
            const newMessage = action.payload;

            const isExist = state.messages.find(msg => msg.id === newMessage.id);
            if (isExist) return state;

            const updatedMessagesList = [...state.messages, newMessage];

            const chatToUpdate = state.chats.find(chat => chat.id === newMessage.chat?.id);
            
            let newChatsList = state.chats;

            if (chatToUpdate) {
                const updatedChat = {
                    ...chatToUpdate,
                    messages: [...chatToUpdate.messages, newMessage]
                };

                const otherChats = state.chats.filter(chat => chat.id !== newMessage.chat?.id);

                newChatsList = [updatedChat, ...otherChats];
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
            console.log("REDUCER: Đang xử lý MARK_MESSAGE_READ cho ChatID:", chatId);
            
            const updatedChatsRead = state.chats.map(chat => {
                if (chat.id == chatId) {
                    console.log("REDUCER: Tìm thấy chat cần update!");
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