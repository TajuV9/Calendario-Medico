package com.misalud.misalud_api.service;

import com.misalud.misalud_api.model.UserModel;
import com.misalud.misalud_api.io.AccountRequest;
import com.misalud.misalud_api.io.AccountResponse;
import com.misalud.misalud_api.repository.UserRepository;
import com.misalud.misalud_api.util.Tools;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AccountResponse createAccount(AccountRequest req) {
        UserModel newAccount = convertToUserEntity(req);
        if(!userRepository.existsByEmail(req.getEmail())) {
            newAccount = userRepository.save(newAccount);
            return converToAccountResponse(newAccount);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already in use");
    }

    @Override
    public AccountResponse getAccount(String email) {
        UserModel is_exist = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found " + email));
        return converToAccountResponse(is_exist);
    }

    private AccountResponse converToAccountResponse(UserModel newAccount) {
        return AccountResponse.builder()
                .name(newAccount.getName())
                .email(newAccount.getEmail())
                .userId(newAccount.getUserId())
                .build();
    }

    private UserModel convertToUserEntity(AccountRequest req) {
        return UserModel.builder()
                .email(req.getEmail())
                .userId(UUID.randomUUID().toString())
                .name(Tools.fixDataPoint(req.getName()))
                .password(passwordEncoder.encode(req.getPassword()))
                .build();
    }
}
