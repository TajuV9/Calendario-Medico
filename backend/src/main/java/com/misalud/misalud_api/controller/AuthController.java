package com.misalud.misalud_api.controller;


import com.misalud.misalud_api.io.AuthRequest;
import com.misalud.misalud_api.io.AuthResponse;
import com.misalud.misalud_api.service.AppUserDetailsService;
import com.misalud.misalud_api.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {

        System.out.println("Email sent: " + authRequest.getEmail());
        System.out.println("Password sent: " + authRequest.getPassword());
        try {
            authenticate(authRequest.getEmail(), authRequest.getPassword());
            final UserDetails userDetails = appUserDetailsService.loadUserByUsername(authRequest.getEmail());
            final String jwtToken = jwtUtil.generateToken(userDetails);
            ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken).httpOnly(true).path("/").maxAge(Duration.ofMinutes(60)).sameSite("Strict").build();
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(new AuthResponse(authRequest.getEmail(), jwtToken));
        } catch (BadCredentialsException e) {
            Map<String, Object> errors = new HashMap<>();
            errors.put("error", true);
            errors.put("message", "Email or password is incorrect");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        } catch (Exception e) {
            Map<String, Object> errors = new HashMap<>();
            errors.put("error", true);
            errors.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errors);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie expiredCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0) 
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expiredCookie.toString())
                .body(Map.of("message", "Logged out successfully"));
    }

    private void authenticate(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }
}
