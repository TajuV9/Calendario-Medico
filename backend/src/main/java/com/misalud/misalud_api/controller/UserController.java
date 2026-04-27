package com.misalud.misalud_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.misalud.misalud_api.dto.UserDTO;
import com.misalud.misalud_api.io.ChangePasswordRequest;
import com.misalud.misalud_api.model.UserModel;
import com.misalud.misalud_api.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Obtener usuario
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        String email = authentication.getName(); 
        UserModel user = userService.getUser(email);
        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
        
        return ResponseEntity.ok(userDTO);
    }

    // Borrar usuario
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    	userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
 // Actualizar contraseña
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        UserModel user = userService.getUser(request.getEmail());

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña antigua incorrecta");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userService.updateUser(user);

        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }
}
