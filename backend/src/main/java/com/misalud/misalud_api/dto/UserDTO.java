package com.misalud.misalud_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserDTO {
    private final Long id;
    private final String name;
    private final String email;
}