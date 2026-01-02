package com.duli.duli_social.request;


public class CreateChatRequest {

    private Long userId;

    public CreateChatRequest() {
        
    }

    public Long getUserId() {
        return userId;
    }

    public CreateChatRequest(Long userId) {
        this.userId = userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    
}

