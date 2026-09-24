package com.ai.Resume.analyser.model;

public class Job {

    private String id;
    private String title;
    private String description;
    private Company company;
    private Location location;
    private String redirect_url;

    public Job() {
    }

    public Job(
            String id,
            String title,
            String description,
            Company company,
            Location location,
            String redirect_url) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.company = company;
        this.location = location;
        this.redirect_url = redirect_url;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getRedirect_url() {
        return redirect_url;
    }

    public void setRedirect_url(String redirect_url) {
        this.redirect_url = redirect_url;
    }
}
