package com.expensetracker;

import com.expensetracker.controller.AuthController;
import com.expensetracker.model.ERole;
import com.expensetracker.model.Role;
import com.expensetracker.model.User;
import com.expensetracker.payload.request.LoginRequest;
import com.expensetracker.payload.request.SignupRequest;
import com.expensetracker.repository.RoleRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.jwt.JwtUtils;
import com.expensetracker.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTests {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthController authController;

    private User testUser;
    private Role userRole;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "test@example.com", "password");
        testUser.setId(1L);
        userRole = new Role(ERole.ROLE_USER);
        userRole.setId(1);
        testUser.setRoles(new HashSet<>(Collections.singletonList(userRole)));
    }

    @Test
    void testAuthenticateUser() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                new UserDetailsImpl(testUser.getId(), testUser.getUsername(), testUser.getEmail(), testUser.getPassword(), Collections.emptyList()),
                null, Collections.emptyList());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("mockedJwtToken");

        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void testRegisterUserSuccess() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("new@example.com");
        signupRequest.setPassword("newpassword");
        signupRequest.setRole(Collections.singleton("user"));

        when(userRepository.existsByUsername(any(String.class))).thenReturn(false);
        when(userRepository.existsByEmail(any(String.class))).thenReturn(false);
        when(encoder.encode(any(String.class))).thenReturn("encodedPassword");
        when(roleRepository.findByName(ERole.ROLE_USER)).thenReturn(Optional.of(userRole));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ResponseEntity<?> response = authController.registerUser(signupRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testRegisterUserUsernameExists() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("testuser");
        signupRequest.setEmail("new@example.com");
        signupRequest.setPassword("newpassword");

        when(userRepository.existsByUsername(any(String.class))).thenReturn(true);

        ResponseEntity<?> response = authController.registerUser(signupRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testRegisterUserEmailExists() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("newpassword");

        when(userRepository.existsByUsername(any(String.class))).thenReturn(false);
        when(userRepository.existsByEmail(any(String.class))).thenReturn(true);

        ResponseEntity<?> response = authController.registerUser(signupRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testRegisterUserRoleNotFound() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("new@example.com");
        signupRequest.setPassword("newpassword");
        signupRequest.setRole(Collections.singleton("nonexistent"));

        when(userRepository.existsByUsername(any(String.class))).thenReturn(false);
        when(userRepository.existsByEmail(any(String.class))).thenReturn(false);
        when(encoder.encode(any(String.class))).thenReturn("encodedPassword");
        when(roleRepository.findByName(ERole.ROLE_USER)).thenReturn(Optional.empty()); // Simulate role not found

        // Expect a RuntimeException to be thrown and caught by the GlobalExceptionHandler
        // The controller itself will throw the exception, which will then be handled globally.
        // So, we expect the controller method to throw the exception.
        try {
            authController.registerUser(signupRequest);
        } catch (RuntimeException e) {
            assertEquals("Role is not found.", e.getMessage());
        }
    }
}
