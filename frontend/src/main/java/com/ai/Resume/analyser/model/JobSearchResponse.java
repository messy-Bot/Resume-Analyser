package com.ai.Resume.analyser.model;

import java.util.List;

public class JobSearchResponse {

    private List<Job> results;

    private int count;

    public JobSearchResponse() {
    }

    public List<Job> getResults() {
        return results;
    }

    public void setResults(
            List<Job> results) {

        this.results = results;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
