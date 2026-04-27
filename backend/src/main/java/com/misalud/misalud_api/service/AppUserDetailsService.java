package com.misalud.misalud_api.service;

import com.misalud.misalud_api.model.UserModel;
import com.misalud.misalud_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel is_exist = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("No se ha encontrado el usuario " + username));
        return new User(is_exist.getEmail(), is_exist.getPassword(), new ArrayDeque<>());
    }
 }
