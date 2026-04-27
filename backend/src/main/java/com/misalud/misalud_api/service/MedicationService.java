package com.misalud.misalud_api.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.misalud.misalud_api.dto.MedicationDTO;
import com.misalud.misalud_api.model.Medication;
import com.misalud.misalud_api.repository.MedicationRepository;
import com.misalud.misalud_api.util.App_Constants;
import com.misalud.misalud_api.util.Tools;

@Service
public class MedicationService {
	
	@Autowired
	MedicationRepository medicationRepository;
	
	public List<MedicationDTO> getUserMedications(Long userId) {
		List<Medication> medications = medicationRepository
				.findActiveMedications(userId, LocalDate.now());
	    return getDTO(medications);
	}

    public List<MedicationDTO> getUserOneDayMedications(Long userId, LocalDate date) {
    	List<Medication> dayMedications = medicationRepository
    			.findByUserModelIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(userId, date, date);
    	return getDTO(dayMedications);
    }

    public MedicationDTO getMedication(Long id) {
    	Optional<Medication> medication = medicationRepository.findById(id);
        return medication.isPresent() ? getDTO(medication.get()) : null;
    }

    public Medication saveMedication(Medication m) {
    	m.setName(Tools.fixDataPoint(m.getName()));
    	m.setDays(Tools.fixDataPoint(m.getDays()));
    	m.setAdditionalInfo(Tools.fixDataPoint(Tools.setNull(m.getAdditionalInfo())));
        return medicationRepository.save(m);
    }

    public void deleteMedication(Long id) {
    	medicationRepository.deleteById(id);
    }
    
    public MedicationDTO getDTO(Medication m) {
        return MedicationDTO.builder()
        		.id(m.getId())
                .name(m.getName())
                .doses(m.getDoses())
                .frequency(m.getFrequency())
                .days(m.getDays())
                .startDate(m.getStartDate().format(App_Constants.FORMATTER_DATE))
                .endDate(m.getEndDate().format(App_Constants.FORMATTER_DATE))
                .additionalInfo(m.getAdditionalInfo())
                .userId(m.getUserModel().getId())
                .build();
    }

    private List<MedicationDTO> getDTO(List<Medication> medications) {
        return medications.stream().map(this::getDTO).toList();
    }
    
    /*
    @Scheduled(cron = "${cron.hour}")
    public void deleteExpiredMedications() {
        medicationRepository.deleteAllExpired(LocalDate.now());
    }
    */
}
