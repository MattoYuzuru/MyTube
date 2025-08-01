package com.mytube.service;

import com.mytube.dto.UserDTO;
import com.mytube.entity.Channel;
import com.mytube.entity.OAuthProvider;
import com.mytube.entity.User;
import com.mytube.entity.enums.UserRole;
import com.mytube.repository.ChannelRepository;
import com.mytube.repository.OAuthProviderRepository;
import com.mytube.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;
    private final OAuthProviderRepository oAuthProviderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return buildUserDetails(user);
    }

    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(User user) {
        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash() != null ? user.getPasswordHash() : "")
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(!user.getIsActive())
                .credentialsExpired(false)
                .disabled(!user.getIsActive())
                .build();
    }

    @Transactional
    public User registerUser(UserDTO.RegisterRequest request) {
        // Проверяем существование пользователя
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Создаем пользователя
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .birthDate(request.getBirthDate())
                .sex(request.getSex())
                .phoneNumber(request.getPhoneNumber())
                .role(UserRole.USER)
                .isActive(true)
                .isEmailVerified(false)
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getEmail());

        return user;
    }

    @Transactional
    public User processOAuth2User(String provider, String providerId, String email,
                                  String firstName, String lastName, String avatarUrl) {

        // Проверяем существующего пользователя OAuth
        Optional<OAuthProvider> existingOAuth = oAuthProviderRepository
                .findByProviderAndProviderUserId(provider, providerId);

        if (existingOAuth.isPresent()) {
            User user = existingOAuth.get().getUser();
            user.setLastLoginAt(LocalDateTime.now());
            return userRepository.save(user);
        }

        // Проверяем пользователя по email
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // Создаем нового пользователя
            String username = generateUniqueUsername(firstName, lastName);

            user = User.builder()
                    .email(email)
                    .username(username)
                    .firstName(firstName != null ? firstName : "")
                    .lastName(lastName != null ? lastName : "")
                    .avatarUrl(avatarUrl)
                    .role(UserRole.USER)
                    .isActive(true)
                    .isEmailVerified(true) // OAuth пользователи считаются верифицированными
                    .build();

            user = userRepository.save(user);
            log.info("OAuth user created: {}", user.getEmail());
        }

        // Создаем запись OAuth провайдера
        OAuthProvider oAuthProvider = OAuthProvider.builder()
                .user(user)
                .provider(provider)
                .providerUserId(providerId)
                .build();

        oAuthProviderRepository.save(oAuthProvider);
        user.setLastLoginAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    private String generateUniqueUsername(String firstName, String lastName) {
        String baseUsername = (firstName + lastName).toLowerCase()
                .replaceAll("[^a-zA-Z0-9]", "");

        if (baseUsername.length() < 3) {
            baseUsername = "user" + baseUsername;
        }

        String username = baseUsername;
        int counter = 1;

        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }

        return username;
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public User updateProfile(UUID userId, UserDTO.UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getBirthDate() != null) {
            user.setBirthDate(request.getBirthDate());
        }
        if (request.getSex() != null) {
            user.setSex(request.getSex());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getBannerUrl() != null) {
            user.setBannerUrl(request.getBannerUrl());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(UUID userId, UserDTO.ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPasswordHash() != null &&
                !passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public UserDTO.UserProfile getUserProfile(UUID userId) {
        User user = userRepository.findByIdWithChannel(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserProfile(user);
    }

    private UserDTO.UserProfile mapToUserProfile(User user) {
        UserDTO.ChannelInfo channelInfo = null;
        if (user.getChannel() != null) {
            Channel channel = user.getChannel();
            channelInfo = UserDTO.ChannelInfo.builder()
                    .id(channel.getId())
                    .channelName(channel.getChannelName())
                    .description(channel.getDescription())
                    .subscriberCount(channel.getSubscriberCount())
                    .videoCount(channel.getVideoCount())
                    .viewCount(channel.getViewCount())
                    .createdAt(channel.getCreatedAt())
                    .build();
        }

        return UserDTO.UserProfile.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .birthDate(user.getBirthDate())
                .sex(user.getSex())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .bannerUrl(user.getBannerUrl())
                .isEmailVerified(user.getIsEmailVerified())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .channel(channelInfo)
                .build();
    }

    @Transactional
    public void updateLastLogin(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }
}