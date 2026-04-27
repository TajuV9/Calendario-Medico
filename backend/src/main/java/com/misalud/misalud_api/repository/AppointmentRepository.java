package com.misalud.misalud_api.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.misalud.misalud_api.model.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long>{
	
	List<Appointment> findByUserModelIdAndDateAfterOrderByDateAscTypeAsc(Long userId, LocalDateTime now);
	Optional<Appointment> findFirstByUserModelIdAndDateAfterOrderByDateAsc(Long userId, LocalDateTime now);
	
	@Query("SELECT a FROM Appointment a "
			+ "WHERE a.userModel.id = :userId "
			+ "AND a.date BETWEEN :startDay AND :endDay "
			+ "ORDER BY a.date ASC")
	List<Appointment> findAppointmentsByUserAndDate(Long userId, LocalDateTime startDay, LocalDateTime endDay);
	
	/*
	@Transactional
    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.date < :today")
    void deleteAllExpired(@Param("today") LocalDateTime today);
    */
}
