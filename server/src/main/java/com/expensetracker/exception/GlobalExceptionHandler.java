package com.expensetracker.exception;

import com.expensetracker.payload.response.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<MessageResponse> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        return new ResponseEntity<>(new MessageResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<MessageResponse> handleBadCredentialsException(BadCredentialsException ex) {
        return new ResponseEntity<>(new MessageResponse("Invalid username or password"), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<MessageResponse> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(new MessageResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // You can add more specific exception handlers here
}
