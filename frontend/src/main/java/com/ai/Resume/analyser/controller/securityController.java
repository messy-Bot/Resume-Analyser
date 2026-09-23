package com.ai.Resume.analyser.controller;

import com.ai.Resume.analyser.model.resetOtp;
import com.ai.Resume.analyser.model.resetOtpVerification;
import com.ai.Resume.analyser.model.resetPasscode;
import com.ai.Resume.analyser.model.userLogin;
import com.ai.Resume.analyser.model.userRegister;
import com.ai.Resume.analyser.model.verifyEmailOtp;
import com.ai.Resume.analyser.service.securityService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/resumeAnalyser/entry/v1")
public class securityController {


    private final securityService service;


    public securityController(
            securityService service) {

        this.service = service;
    }


    @PostMapping("/verifyEmail")
    public ResponseEntity<?> verifyEmail(

            @Valid
            @RequestBody
            verifyEmailOtp request) {

        return service.verifyEmail(
                request
        );
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(

            @Valid
            @RequestBody
            userRegister request) {

        return service.register(
                request
        );
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(

            @Valid
            @RequestBody
            userLogin request) {

        return service.login(
                request
        );
    }


    @PostMapping("/resetOtpSent")
    public ResponseEntity<?> sendResetOtp(

            @Valid
            @RequestBody
            resetOtp request) {

        return service.sentResetOtp(
                request
        );
    }


    @PostMapping("/verifyResetOtp")
    public ResponseEntity<?> verifyResetOtp(

            @Valid
            @RequestBody
            resetOtpVerification request) {

        return service.verifyResetOtp(
                request
        );
    }


    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(

            @Valid
            @RequestBody
            resetPasscode request) {

        return service.resetAccountPassword(
                request
        );
    }
}
