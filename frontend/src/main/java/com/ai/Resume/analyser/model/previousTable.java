package com.ai.Resume.analyser.model;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class previousTable {

    @Id
    private String email;

    private int score;

    private int atsoptimizationscore;

    private String roles;

    @ElementCollection
    @Column(length = 450)
    private List<String> pros;

    @ElementCollection
    @Column(length = 450)
    private List<String> cons;

    @ElementCollection
    @Column(length = 450)
    private List<String> suggestions;
}
