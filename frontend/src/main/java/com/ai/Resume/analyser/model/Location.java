package com.ai.Resume.analyser.model;

public class Location {

    private String display_name;

    public Location() {
    }

    public Location(String display_name) {
        this.display_name = display_name;
    }

    public String getDisplay_name() {
        return display_name;
    }

    public void setDisplay_name(
            String display_name) {

        this.display_name =
                display_name;
    }
}
