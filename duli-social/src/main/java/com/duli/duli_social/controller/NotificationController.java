package com.duli.duli_social.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.duli.duli_social.dto.NotificationDto;
import com.duli.duli_social.models.User;
import com.duli.duli_social.service.NotificationService;
import com.duli.duli_social.service.UserService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserService userService;

    @GetMapping
    public List<NotificationDto> getUsersNotification(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserByJwt(jwt);
        return notificationService.findUsersNotification(user.getId());
    }
}