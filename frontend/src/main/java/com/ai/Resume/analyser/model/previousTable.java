package com.ai.Resume.analyser.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class previousTable {

    @Id
    private String email;

    private String report;

    public previousTable() {
    }

    public previousTable(
            String email,
            String report) {

        this.email = email;
        this.report = report;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
    }

    public String getReport() {
        return report;
    }

    public void setReport(
            String report) {

        this.report = report;
    }
}
