package com.misalud.misalud_api.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.misalud.misalud_api.model.UserModel;
import com.misalud.misalud_api.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	UserRepository userRepository;
	
	public UserModel getUser(String email) {
	    Optional<UserModel> user = userRepository.findByEmail(email);
	    return user.isPresent() ? user.get() : null;
	}
	
	public Optional<UserModel> getUser(Long id) {
	    return userRepository.findById(id);
	}
	
	public void deleteUser(Long id) {
		userRepository.deleteById(id);
	}
	
	public UserModel updateUser(UserModel user) {
		return userRepository.save(user);
	}
}
