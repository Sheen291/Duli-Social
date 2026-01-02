package com.duli.duli_social.service;

import java.util.List;

import com.duli.duli_social.dto.UserDto;
import com.duli.duli_social.models.User;
import com.duli.duli_social.response.AuthResponse;

public interface UserService {

    public User registerUser(User user);
    
    public User findUserById(Long userId) throws Exception;

    public User findUserByEmail(String email);

    public User followUser(Long reqUserId, Long acceptUserId) throws Exception;

    public User updateUser(User user, Long userId) throws Exception;

    public List<UserDto> searchUser(String query);

    public User findUserByJwt(String jwt);
    
    public UserDto findUserDtoByJwt(String jwt);

    public AuthResponse loginWithGoogle(String code) throws Exception;
}