package com.mytube.dto;

import com.mytube.entity.enums.UserRole;
import com.mytube.entity.enums.UserSex;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class UserDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        @Size(min = 3, max = 50)
        private String username;

        @NotBlank
        @Size(min = 1, max = 100)
        private String firstName;

        @NotBlank
        @Size(min = 1, max = 100)
        private String lastName;

        @NotBlank
        @Size(min = 6, max = 100)
        private String password;

        private LocalDate birthDate;
        private UserSex sex;
        private String phoneNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank
        private String emailOrUsername;

        @NotBlank
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private UserProfile user;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfile {
        private UUID id;
        private String email;
        private String username;
        private String firstName;
        private String lastName;
        private LocalDate birthDate;
        private UserSex sex;
        private String phoneNumber;
        private String avatarUrl;
        private String bannerUrl;
        private Boolean isEmailVerified;
        private UserRole role;
        private LocalDateTime createdAt;
        private LocalDateTime lastLoginAt;
        private ChannelInfo channel;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChannelInfo {
        private UUID id;
        private String channelName;
        private String description;
        private Long subscriberCount;
        private Long videoCount;
        private Long viewCount;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {
        private String firstName;
        private String lastName;
        private LocalDate birthDate;
        private UserSex sex;
        private String phoneNumber;
        private String avatarUrl;
        private String bannerUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangePasswordRequest {
        @NotBlank
        private String currentPassword;

        @NotBlank
        @Size(min = 6, max = 100)
        private String newPassword;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RefreshTokenRequest {
        @NotBlank
        private String refreshToken;
    }
}