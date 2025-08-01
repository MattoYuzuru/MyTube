package com.mytube.controller;

import com.mytube.config.JwtConfig;
import com.mytube.dto.UserDTO;
import com.mytube.entity.User;
import com.mytube.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtConfig jwtConfig;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO.RegisterRequest request) {
        try {
            User user = userService.registerUser(request);

            // Автоматический вход после регистрации
            UserDetails userDetails = userService.loadUserByEmail(user.getEmail());
            String accessToken = jwtConfig.generateAccessToken(userDetails, user.getId());
            String refreshToken = jwtConfig.generateRefreshToken(userDetails, user.getId());

            UserDTO.UserProfile userProfile = userService.getUserProfile(user.getId());

            UserDTO.AuthResponse response = UserDTO.AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .user(userProfile)
                    .build();

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserDTO.LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmailOrUsername(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Обновляем время последнего входа
            userService.updateLastLogin(user.getEmail());

            String accessToken = jwtConfig.generateAccessToken(userDetails, user.getId());
            String refreshToken = jwtConfig.generateRefreshToken(userDetails, user.getId());

            UserDTO.UserProfile userProfile = userService.getUserProfile(user.getId());

            UserDTO.AuthResponse response = UserDTO.AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .user(userProfile)
                    .build();

            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Invalid credentials"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody UserDTO.RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();

            if (!jwtConfig.isRefreshToken(refreshToken)) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Invalid refresh token"));
            }

            String username = jwtConfig.extractUsername(refreshToken);
            UserDetails userDetails = userService.loadUserByUsername(username);

            if (jwtConfig.validateToken(refreshToken, userDetails)) {
                User user = userService.findByEmail(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                String newAccessToken = jwtConfig.generateAccessToken(userDetails, user.getId());
                String newRefreshToken = jwtConfig.generateRefreshToken(userDetails, user.getId());

                UserDTO.AuthResponse response = UserDTO.AuthResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(newRefreshToken)
                        .build();

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Invalid refresh token"));
            }

        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Token refresh failed"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserDTO.UserProfile userProfile = userService.getUserProfile(user.getId());
            return ResponseEntity.ok(userProfile);

        } catch (Exception e) {
            log.error("Failed to get current user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to get user info"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // В статeless JWT системе логаут обычно обрабатывается на фронтенде
        // Можно добавить токен в blacklist если нужно
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully logged out");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userService.findByEmail(email).isPresent();
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean exists = userService.findByUsername(username).isPresent();
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        return errorResponse;
    }
}