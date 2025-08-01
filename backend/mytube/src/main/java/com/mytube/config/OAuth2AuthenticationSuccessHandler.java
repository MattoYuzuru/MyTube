package com.mytube.config;

import com.mytube.entity.User;
import com.mytube.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtConfig jwtConfig;

    @Value("${app.oauth2.authorized-redirect-uri:http://localhost:3000/oauth2/redirect}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String registrationId = getRegistrationId(request);

        try {
            User user = processOAuth2User(oAuth2User, registrationId);
            UserDetails userDetails = userService.loadUserByEmail(user.getEmail());

            String accessToken = jwtConfig.generateAccessToken(userDetails, user.getId());
            String refreshToken = jwtConfig.generateRefreshToken(userDetails, user.getId());

            String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("token", accessToken)
                    .queryParam("refreshToken", refreshToken)
                    .build().toUriString();

            getRedirectStrategy().sendRedirect(request, response, targetUrl);

        } catch (Exception e) {
            log.error("OAuth2 authentication failed", e);
            String errorUrl = UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("error", "authentication_failed")
                    .build().toUriString();

            getRedirectStrategy().sendRedirect(request, response, errorUrl);
        }
    }

    private User processOAuth2User(OAuth2User oAuth2User, String registrationId) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = null;
        String firstName = null;
        String lastName = null;
        String providerId = null;
        String avatarUrl = null;

        switch (registrationId.toLowerCase()) {
            case "google":
                email = (String) attributes.get("email");
                firstName = (String) attributes.get("given_name");
                lastName = (String) attributes.get("family_name");
                providerId = (String) attributes.get("sub");
                avatarUrl = (String) attributes.get("picture");
                break;

            case "github":
                email = (String) attributes.get("email");
                String name = (String) attributes.get("name");
                if (name != null && name.contains(" ")) {
                    String[] nameParts = name.split(" ", 2);
                    firstName = nameParts[0];
                    lastName = nameParts[1];
                } else {
                    firstName = name != null ? name : (String) attributes.get("login");
                    lastName = "";
                }
                providerId = String.valueOf(attributes.get("id"));
                avatarUrl = (String) attributes.get("avatar_url");
                break;
        }

        return userService.processOAuth2User(registrationId, providerId, email, firstName, lastName, avatarUrl);
    }

    private String getRegistrationId(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        if (requestUri.contains("/oauth2/authorization/")) {
            return requestUri.substring(requestUri.lastIndexOf("/") + 1);
        }
        return "unknown";
    }
}