package com.misalud.misalud_api.service;


import com.misalud.misalud_api.io.AccountRequest;
import com.misalud.misalud_api.io.AccountResponse;

public interface AccountService {

    AccountResponse createAccount(AccountRequest req);
    AccountResponse getAccount(String email);
}
