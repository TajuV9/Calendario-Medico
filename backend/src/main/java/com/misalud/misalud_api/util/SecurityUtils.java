package com.misalud.misalud_api.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.misalud.misalud_api.service.UserService;

@Component
public class SecurityUtils {

	@Autowired
    private UserService userService;

    public boolean isUserIdAllowed(Long userId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String email = authentication.getName();
        Long userIdFromToken = userService.getUser(email).getId();
        return userIdFromToken != null && userIdFromToken.equals(userId);
    }
}
