package com.expensetracker;

import com.expensetracker.exception.GlobalExceptionHandler;
import com.expensetracker.payload.response.MessageResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class GlobalExceptionHandlerTests {

    private GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();

    @Test
    void testHandleUsernameNotFoundException() {
        UsernameNotFoundException ex = new UsernameNotFoundException("User not found");
        ResponseEntity<MessageResponse> response = globalExceptionHandler.handleUsernameNotFoundException(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody().getMessage());
    }

    @Test
    void testHandleBadCredentialsException() {
        BadCredentialsException ex = new BadCredentialsException("Invalid credentials");
        ResponseEntity<MessageResponse> response = globalExceptionHandler.handleBadCredentialsException(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid username or password", response.getBody().getMessage());
    }

    @Test
    void testHandleRuntimeException() {
        RuntimeException ex = new RuntimeException("Something went wrong");
        ResponseEntity<MessageResponse> response = globalExceptionHandler.handleRuntimeException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Something went wrong", response.getBody().getMessage());
    }
}
