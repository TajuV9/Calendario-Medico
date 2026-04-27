package com.misalud.misalud_api.repository;

import com.misalud.misalud_api.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findByEmail(String email);
    Boolean existsByEmail(String email);
	Optional<UserModel> findById(Long id);
}
