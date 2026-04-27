package com.misalud.misalud_api.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.misalud.misalud_api.model.Medication;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
	
	@Query("SELECT m FROM Medication m "
			+ "WHERE m.userModel.id = :userId "
			+ "AND m.endDate >= :currentDate "
			+ "ORDER BY m.startDate ASC, m.name ASC"
			)
	List<Medication> findActiveMedications(Long userId, LocalDate currentDate);
	
	List<Medication> findByUserModelIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
			Long userId, LocalDate dayDate, 
			LocalDate sameDayDate);
	
	/*
	@Transactional
    @Modifying
    @Query("DELETE FROM Medication m WHERE m.endDate < :today")
    void deleteAllExpired(@Param("today") LocalDate today);
    */
}
