package com.misalud.misalud_api.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.misalud.misalud_api.dto.AppointmentDTO;
import com.misalud.misalud_api.model.Appointment;
import com.misalud.misalud_api.service.AppointmentService;
import com.misalud.misalud_api.util.SecurityUtils;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private SecurityUtils securityUtils;

    // Obtener citas próximas
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AppointmentDTO>> getAppointments(@PathVariable Long userId, Authentication authentication) {
        if (!securityUtils.isUserIdAllowed(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<AppointmentDTO> appointments = appointmentService.getUserAppointments(userId);
        return appointments.size() > 0 ? ResponseEntity.ok(appointments) : ResponseEntity.notFound().build();
    }

    // Obtener cita por ID
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id) {
        AppointmentDTO dto = appointmentService.getAppointment(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    // Obtener citas de un día concreto
    @GetMapping("/date/{chosenDay}/user/{userId}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDate(@PathVariable Long userId,
                                                                      @PathVariable LocalDate chosenDay,
                                                                      Authentication authentication) {
        if (!securityUtils.isUserIdAllowed(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<AppointmentDTO> appointments = appointmentService.getOneDayAppointments(userId, chosenDay);
        return appointments.size() > 0 ? ResponseEntity.ok(appointments) : ResponseEntity.notFound().build();
    }

    // Obtener cita más cercana
    @GetMapping("/user/{userId}/next")
    public ResponseEntity<AppointmentDTO> getNextAppointment(@PathVariable Long userId, Authentication authentication) {
        if (!securityUtils.isUserIdAllowed(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        AppointmentDTO dto = appointmentService.getNextAppointment(userId);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    // Crear nueva cita
    @PostMapping
    public ResponseEntity<AppointmentDTO> createNewAppointment(@RequestBody Appointment appointment, Authentication authentication) {
        Long userId = appointment.getUserModel().getId();
        if (!securityUtils.isUserIdAllowed(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Appointment created = appointmentService.saveAppointment(appointment);
        AppointmentDTO dto = appointmentService.getDTO(created);
        return ResponseEntity.ok(dto);
    }

    // Actualizar cita
    @PutMapping("/{id}")
    public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment,
                                                            Authentication authentication) {
        Long userId = appointment.getUserModel().getId();
        if (!securityUtils.isUserIdAllowed(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        appointment.setId(id);
        Appointment updated = appointmentService.saveAppointment(appointment);
        AppointmentDTO dto = appointmentService.getDTO(updated);
        return ResponseEntity.ok(dto);
    }

    // Borrar cita
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id, Authentication authentication) {
        AppointmentDTO dto = appointmentService.getAppointment(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        if (!securityUtils.isUserIdAllowed(dto.getUserId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
