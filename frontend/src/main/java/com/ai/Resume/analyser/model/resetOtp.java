package com.ai.Resume.analyser.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class resetOtp {

    @NotBlank
    @Email
    private String email;

    public resetOtp() {
    }

    public resetOtp(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
    }
}
