package com.ai.Resume.analyser.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.Date;

@Entity
public class otpVerify {

    @Id
    private String email;

    private String verifyOtp;

    private Date verifyExpiration;

    public otpVerify() {
    }

    public otpVerify(
            String email,
            String verifyOtp,
            Date verifyExpiration) {

        this.email = email;
        this.verifyOtp = verifyOtp;
        this.verifyExpiration = verifyExpiration;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
    }

    public String getVerifyOtp() {
        return verifyOtp;
    }

    public void setVerifyOtp(
            String verifyOtp) {

        this.verifyOtp = verifyOtp;
    }

    public Date getVerifyExpiration() {
        return verifyExpiration;
    }

    public void setVerifyExpiration(
            Date verifyExpiration) {

        this.verifyExpiration =
                verifyExpiration;
    }
}
