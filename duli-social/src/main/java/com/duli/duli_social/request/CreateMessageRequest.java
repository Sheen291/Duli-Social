package com.duli.duli_social.request;

public class CreateMessageRequest {
    
    private Long chatId;
    private String content;
    private String image;
    private String video;

    public CreateMessageRequest() {
    }

    public CreateMessageRequest(Long chatId, String content, String image, String video) {
        this.chatId = chatId;
        this.content = content;
        this.image = image;
        this.video = video;
    }


    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }
}