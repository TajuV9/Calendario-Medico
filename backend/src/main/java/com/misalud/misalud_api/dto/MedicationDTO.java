package com.misalud.misalud_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MedicationDTO {
	private final Long id;
    private final String name;
    private final Integer doses;
    private final Integer frequency;
    private final Integer days;
    private final String startDate;
    private final String endDate;
    private final String additionalInfo;
    private final Long userId;
}
