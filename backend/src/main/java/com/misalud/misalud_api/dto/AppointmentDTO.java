package com.misalud.misalud_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AppointmentDTO {
	private final Long id;
	private final String type;
    private final String name;
    private final String city;
    private final String street;
    private final String number;
    private final String date;
    private final String hour;
    private final String additionalInfo;
    private final Long userId;
}
