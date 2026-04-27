package com.misalud.misalud_api.io;

import lombok.Data;

@Data
public class ChangePasswordRequest {
	private final String email;
    private final String oldPassword;
    private final String newPassword;
}
