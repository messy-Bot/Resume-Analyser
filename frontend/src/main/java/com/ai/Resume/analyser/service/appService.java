package com.ai.Resume.analyser.service;

import com.ai.Resume.analyser.model.*;
import com.ai.Resume.analyser.repository.prevTable;
import com.ai.Resume.analyser.repository.usersTableRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.google.genai.types.ThinkingConfig;
import com.google.genai.types.ThinkingLevel;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class appService {

    @Value("${genKey}")
    private String genKey;

    @Value("${application-id}")
    private String applicationId;

    @Value("${application-api-key}")
    private String applicationApiKey;

    @Autowired
    private prevTable previousTableRepo;

    @Autowired
    private usersTableRepo usersTableRepository;


    public ResponseEntity<?> extract(
            String roles,
            MultipartFile file)
            throws TikaException, IOException, InterruptedException {

        if (file == null || file.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Please upload a resume");
        }

        if (roles == null || roles.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("Please select a role");
        }

        Tika tika = new Tika();

        ByteArrayInputStream inputFile =
                new ByteArrayInputStream(file.getBytes());

        String extracted =
                tika.parseToString(inputFile);

        if (extracted == null ||
                extracted.trim().isEmpty() ||
                extracted.length() > 5000) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Please upload a valid resume");
        }


        String results;

        Client client =
                Client.builder()
                        .apiKey(genKey)
                        .build();


        String prompt =
                """
                You are an advanced enterprise-grade ATS resume checker,
                career auditor, hiring-manager evaluator and growth strategist.

                Analyze the given resume strictly according to industry-level
                ATS standards for the specified role.

                Be moderate to strict with scoring.

                A resume should receive 90 to 100 only when it is nearly
                perfect and highly relevant to the specified role.

                Role:
                %s

                Resume Content:
                %s

                Rules and Instructions:

                1. Evaluation Categories and Score Allocation:

                Contact Information - 15 points
                Professional Summary / Objective - 10 points
                Skills - 7 points
                Education - 10 points
                Achievements / Projects - 15 points
                Keywords / ATS readiness - 10 points
                Formatting / Presentation - 5 points
                Grammar and spelling - 10 points
                Basic ATS resume evaluation - 10 points
                Professional structure and layout - 5 points
                Skills matched with role - 8 points

                2. ATS Optimization Score:

                Score separately from 0 to 100 based on:
                ATS parsing readiness
                keyword usage
                readability
                section clarity
                content relevance
                target-role alignment
                resume structure

                3. Scoring:

                Be strict.

                90-100 means nearly flawless and highly relevant.

                50-89 means partially relevant but improvements are needed.

                Below 50 means significant relevance or ATS issues.

                4. Resume standards:

                Use proper headings.

                Use bullet points.

                Avoid images, graphics and tables that interfere with ATS parsing.

                Use clear chronological or functional structure.

                Use action-oriented language.

                Use role-relevant keywords.

                Use relevant technical and soft skills.

                Maintain professional formatting.

                Keep descriptions concise.

                Avoid grammar and spelling mistakes.

                Keep education and experience clearly structured.

                5. Irrelevant content:

                If the resume is completely irrelevant to the specified role,
                return score 0 and atsoptimizationscore 0.

                Return empty pros, cons and suggestions arrays in that case.

                6. Output:

                Return ONLY valid JSON.

                The JSON must contain:

                {
                  "score": number,
                  "atsoptimizationscore": number,
                  "pros": ["string"],
                  "cons": ["string"],
                  "suggestions": ["string"]
                }

                Pros, cons and suggestions should contain 5 to 8 items.

                Each item must be an atomic sentence.

                Each item must be between 50 and 275 characters.

                Do not include markdown.

                Do not include explanations outside JSON.

                Resume:
                %s
                """
                .formatted(
                        roles,
                        extracted,
                        extracted
                );


        Content content =
                Content.builder()
                        .parts(
                                Part.fromText(prompt)
                        )
                        .build();


        int attempts = 0;
        int maxAttempts = 3;

        results = null;

        while (attempts < maxAttempts) {

            attempts++;

            try {

                GenerateContentConfig config =
                        GenerateContentConfig
                                .builder()
                                .temperature(0.0f)
                                .thinkingConfig(
                                        ThinkingConfig
                                                .builder()
                                                .thinkingLevel(
                                                        ThinkingLevel.Known.HIGH
                                                )
                                                .includeThoughts(false)
                                                .build()
                                )
                                .build();


                GenerateContentResponse response =
                        client.models.generateContent(
                                "gemini-3.5-flash-lite",
                                content,
                                config
                        );


                results = response.text();

                if (results != null &&
                        !results.isBlank()) {

                    break;
                }

            } catch (Exception exception) {

                if (attempts >= maxAttempts) {
                    return ResponseEntity
                            .status(
                                    HttpStatus.SERVICE_UNAVAILABLE
                            )
                            .body(
                                    "Unable to analyse resume at the moment"
                            );
                }

                Thread.sleep(1500);
            }
        }


        if (results == null ||
                results.isBlank()) {

            return ResponseEntity
                    .status(
                            HttpStatus.SERVICE_UNAVAILABLE
                    )
                    .body(
                            "No analysis result received"
                    );
        }


        results = cleanJsonResponse(results);


        ObjectMapper objectMapper =
                new ObjectMapper();

        resultsDto analysisResult =
                objectMapper.readValue(
                        results,
                        resultsDto.class
                );


        if (analysisResult.getScore() != 0) {

            String username =
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            .getName();


            previousTable processedData =
                    new previousTable(
                            username,
                            analysisResult.getScore(),
                            analysisResult
                                    .getAtsoptimizationscore(),
                            roles,
                            analysisResult.getPros(),
                            analysisResult.getCons(),
                            analysisResult.getSuggestions()
                    );


            previousTableRepo.save(
                    processedData
            );


            usersTable user =
                    usersTableRepository
                            .findById(username)
                            .orElse(null);


            if (user != null) {

                user.setPreviousResults(true);

                usersTableRepository.save(user);
            }


            return new ResponseEntity<>(
                    "Analysed successfully",
                    HttpStatus.OK
            );
        }


        return new ResponseEntity<>(
                "Invalid document",
                HttpStatus.NOT_ACCEPTABLE
        );
    }


    private String cleanJsonResponse(
            String results) {

        results = results.trim();

        if (results.startsWith("```")) {

            int firstBrace =
                    results.indexOf("{");

            int lastBrace =
                    results.lastIndexOf("}");

            if (firstBrace != -1 &&
                    lastBrace != -1 &&
                    lastBrace > firstBrace) {

                results =
                        results.substring(
                                firstBrace,
                                lastBrace + 1
                        );
            }
        }

        return results.trim();
    }


    public ResponseEntity<?> lastReport() {

        String username =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        previousTable previous =
                previousTableRepo
                        .findById(username)
                        .orElse(null);


        if (previous == null) {

            return new ResponseEntity<>(
                    "No previous Analysis",
                    HttpStatus.NOT_FOUND
            );
        }


        RestTemplate restTemplate =
                new RestTemplate();


        List<Job> jobs;


        String url =
                "https://api.adzuna.com/v1/api/jobs/in/search/1"
                        + "?app_id="
                        + applicationId
                        + "&app_key="
                        + applicationApiKey
                        + "&what="
                        + previous.getRoles()
                        + "&where=tamilnadu"
                        + "&content-type=application/json";


        try {

            JobSearchResponse response =
                    restTemplate.getForObject(
                            url,
                            JobSearchResponse.class
                    );


            if (response == null ||
                    response.getResults() == null) {

                jobs = new ArrayList<>();

            } else {

                jobs = response.getResults();
            }

        } catch (Exception exception) {

            jobs = new ArrayList<>();
        }


        resultsDto result =
                new resultsDto(
                        previous.getScore(),
                        previous.getAtsoptimizationscore(),
                        previous.getPros(),
                        previous.getCons(),
                        previous.getSuggestions(),
                        jobs
                );


        return ResponseEntity.ok(result);
    }


    public ResponseEntity<?> logout() {

        HttpHeaders headers =
                new HttpHeaders();


        ResponseCookie cookie =
                ResponseCookie
                        .from(
                                "entrypasstoken",
                                ""
                        )
                        .httpOnly(true)
                        .secure(false)
                        .sameSite("Lax")
                        .maxAge(0)
                        .path("/")
                        .build();


        headers.add(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );


        return new ResponseEntity<>(
                "Successfully loggedOut",
                headers,
                HttpStatus.OK
        );
    }


    public ResponseEntity<?> deleteAccount() {

        try {

            String username =
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            .getName();


            usersTableRepository
                    .deleteById(username);


            previousTableRepo
                    .deleteById(username);


            HttpHeaders headers =
                    new HttpHeaders();


            ResponseCookie cookie =
                    ResponseCookie
                            .from(
                                    "entrypasstoken",
                                    ""
                            )
                            .httpOnly(true)
                            .secure(false)
                            .sameSite("Lax")
                            .maxAge(0)
                            .path("/")
                            .build();


            headers.add(
                    HttpHeaders.SET_COOKIE,
                    cookie.toString()
            );


            return new ResponseEntity<>(
                    "Account deleted successfully",
                    headers,
                    HttpStatus.OK
            );

        } catch (Exception exception) {

            return new ResponseEntity<>(
                    "Failed to delete",
                    HttpStatus.NOT_FOUND
            );
        }
    }


    public ResponseEntity<?> tokenValidation() {

        String username =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        usersTable user =
                usersTableRepository
                        .findById(username)
                        .orElse(null);


        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid token");
        }


        loginResponse loginRes =
                new loginResponse(
                        user.getUsername(),
                        user.getPreviousResults()
                );


        return new ResponseEntity<>(
                loginRes,
                HttpStatus.OK
        );
    }
}
