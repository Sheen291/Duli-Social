package com.duli.duli_social.exceptions;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class Exceptions {
    //hiển thị lỗi 
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> otherExceptionsHandler(Exception exceptions, WebRequest req) {
        ErrorDetails error = new ErrorDetails(exceptions.getMessage(), req.getDescription(false), LocalDateTime.now());
        return new ResponseEntity<ErrorDetails>(error, HttpStatus.BAD_REQUEST);
    }
}
