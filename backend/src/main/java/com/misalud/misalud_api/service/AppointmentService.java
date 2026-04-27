package com.misalud.misalud_api.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.misalud.misalud_api.dto.AppointmentDTO;
import com.misalud.misalud_api.model.Appointment;
import com.misalud.misalud_api.repository.AppointmentRepository;
import com.misalud.misalud_api.util.App_Constants;
import com.misalud.misalud_api.util.Tools;

@Service
public class AppointmentService {
	
	@Autowired
	AppointmentRepository appointmentRepository;
	
	public List<AppointmentDTO> getUserAppointments(Long userId) {
		List<Appointment> appointments = appointmentRepository
				.findByUserModelIdAndDateAfterOrderByDateAscTypeAsc(userId, LocalDateTime.now());
	    return getDTO(appointments);
	}

    public AppointmentDTO getAppointment(Long id) {
    	return getAppointment(appointmentRepository.findById(id));
    }
    
    public List<AppointmentDTO> getOneDayAppointments(Long userId, LocalDate chosenDate) {
    	LocalDateTime startOfDay, endOfDay;
        startOfDay = chosenDate.atStartOfDay();
        endOfDay = chosenDate.atTime(23, 59, 59); 
        List<Appointment> dayAppointments = appointmentRepository
        		.findAppointmentsByUserAndDate(userId, startOfDay, endOfDay);
        return getDTO(dayAppointments);
    }
    
    public AppointmentDTO getNextAppointment(Long userId) {
    	Optional<Appointment> appointment = appointmentRepository
    			.findFirstByUserModelIdAndDateAfterOrderByDateAsc(userId, LocalDateTime.now());
    	return getAppointment(appointment);
    }

    public Appointment saveAppointment(Appointment a) {
    	a.setType(Tools.fixDataPoint(Tools.setNull(a.getType())));
    	a.setName(Tools.fixDataPoint(Tools.setNull(a.getName())));
    	a.setCity(Tools.fixDataPoint(Tools.setNull(a.getCity())));
    	a.setStreet(Tools.fixDataPoint(Tools.setNull(a.getStreet())));
    	a.setNumber(Tools.setNull(a.getNumber()));
    	a.setAdditionalInfo(Tools.fixDataPoint(Tools.setNull(a.getAdditionalInfo())));
        return appointmentRepository.save(a);
    }

    public void deleteAppointment(Long id) {
    	appointmentRepository.deleteById(id);
    }
    
    public AppointmentDTO getDTO(Appointment a) {
    	LocalDateTime date = a.getDate();
        return AppointmentDTO.builder()
        		.id(a.getId())
        		.type(a.getType())
                .name(a.getName())
                .city(a.getCity())
                .street(a.getStreet())
                .number(a.getNumber())
                .date(date.format(App_Constants.FORMATTER_DATE))
                .hour(date.format(App_Constants.FORMATTER_HOUR))
                .additionalInfo(a.getAdditionalInfo())
                .userId(a.getUserModel().getId())
                .build();
    }

    private List<AppointmentDTO> getDTO(List<Appointment> appointments) {
        return appointments.stream().map(this::getDTO).toList();
    }
    
    private AppointmentDTO getAppointment(Optional<Appointment> a) {
		return a.isPresent() ? getDTO(a.get()) : null;
    }
    
    /*
    @Scheduled(cron = "${cron.hour}")
    public void deleteExpiredAppointments() {
        appointmentRepository.deleteAllExpired(LocalDateTime.now());
    }
    */
}
