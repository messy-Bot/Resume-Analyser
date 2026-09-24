package com.ai.Resume.analyser.model;

public class loginResponse {

    private String username;

    private Boolean previousResults;


    public loginResponse() {
    }


    public loginResponse(
            String username,
            Boolean previousResults) {

        this.username =
                username;

        this.previousResults =
                previousResults;
    }


    public String getUsername() {

        return username;
    }


    public void setUsername(
            String username) {

        this.username =
                username;
    }


    public Boolean getPreviousResults() {

        return previousResults;
    }


    public void setPreviousResults(
            Boolean previousResults) {

        this.previousResults =
                previousResults;
    }
}
