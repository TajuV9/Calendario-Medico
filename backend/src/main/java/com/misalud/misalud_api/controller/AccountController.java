package com.misalud.misalud_api.controller;

import com.misalud.misalud_api.io.AccountRequest;
import com.misalud.misalud_api.io.AccountResponse;
import com.misalud.misalud_api.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse register(@Valid @RequestBody AccountRequest req) {
        AccountResponse response = accountService.createAccount(req);
        return response;
    }

    @GetMapping("/account")
    public AccountResponse getAccount(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return accountService.getAccount(email);
    }

    @GetMapping("/test")
    public String test() {
        return "test";
    }
}
