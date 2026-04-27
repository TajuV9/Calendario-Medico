package com.misalud.misalud_api.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.misalud.misalud_api.dto.MedicationDTO;
import com.misalud.misalud_api.model.Medication;
import com.misalud.misalud_api.service.MedicationService;
import com.misalud.misalud_api.util.SecurityUtils;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    @Autowired
    private MedicationService medicationService;

    @Autowired
    private SecurityUtils securityUtils;

    // Obtener medicamentos actualmente tomando
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedicationDTO>> getMedications(@PathVariable Long userId, Authentication authentication) {
        if (!securityUtils.isUserIdAllowed(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<MedicationDTO> medications = medicationService.getUserMedications(userId);
        return medications.size() > 0 ? ResponseEntity.ok(medications) : ResponseEntity.notFound().build();
    }

    // Obtener medicamentos tomados de un día concreto
    @GetMapping("/date/{chosenDay}/user/{userId}")
    public ResponseEntity<List<MedicationDTO>> getMedicationsByDate(@PathVariable Long userId,
                                                                    @PathVariable LocalDate chosenDay,
                                                                    Authentication authentication) {
        if (!securityUtils.isUserIdAllowed(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<MedicationDTO> medications = medicationService.getUserOneDayMedications(userId, chosenDay);
        return medications.size() > 0 ? ResponseEntity.ok(medications) : ResponseEntity.notFound().build();
    }

    // Obtener medicamento por ID
    @GetMapping("/{id}")
    public ResponseEntity<MedicationDTO> getMedicationById(@PathVariable Long id) {
        MedicationDTO dto = medicationService.getMedication(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    // Crear nuevo medicamento
    @PostMapping
    public ResponseEntity<MedicationDTO> createNewMedication(@RequestBody Medication medication, Authentication authentication) {
        Long userId = medication.getUserModel().getId();
        if (!securityUtils.isUserIdAllowed(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Medication created = medicationService.saveMedication(medication);
        MedicationDTO dto = medicationService.getDTO(created);
        return ResponseEntity.ok(dto);
    }

    // Actualizar medicamento
    @PutMapping("/{id}")
    public ResponseEntity<MedicationDTO> updateMedication(@PathVariable Long id, @RequestBody Medication medication,
                                                          Authentication authentication) {
        Long userId = medication.getUserModel().getId();
        if (!securityUtils.isUserIdAllowed(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        medication.setId(id);
        Medication updated = medicationService.saveMedication(medication);
        MedicationDTO dto = medicationService.getDTO(updated);
        return ResponseEntity.ok(dto);
    }

    // Borrar medicamento
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id, Authentication authentication) {
        MedicationDTO dto = medicationService.getMedication(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        if (!securityUtils.isUserIdAllowed(dto.getUserId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        medicationService.deleteMedication(id);
        return ResponseEntity.noContent().build();
    }
}
