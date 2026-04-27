package com.misalud.misalud_api.io;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountRequest {

    private final String errorMsg = "Enter a valid email address.";

    @NotBlank(message = errorMsg)
    private String name;

    @Email(message = errorMsg)
    @NotNull(message = errorMsg)
    private String email;

    @Size(min = 12, message = "Password must be 12 characters or more.")
    private String password;
}
