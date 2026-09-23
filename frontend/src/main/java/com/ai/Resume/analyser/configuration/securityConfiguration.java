package com.ai.Resume.analyser.configuration;

import com.ai.Resume.analyser.jwt.jwtFilter;
import com.ai.Resume.analyser.service.failureHandler;
import com.ai.Resume.analyser.service.successHandler;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
public class securityConfiguration {


    private final entryPointService userDetails;

    private final jwtFilter jwtfilter;

    private final successHandler successHandler;

    private final failureHandler failureHandler;


    public securityConfiguration(
            entryPointService userDetails,
            jwtFilter jwtfilter,
            successHandler successHandler,
            failureHandler failureHandler) {

        this.userDetails = userDetails;
        this.jwtfilter = jwtfilter;
        this.successHandler = successHandler;
        this.failureHandler = failureHandler;
    }


    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http)
            throws Exception {

        return http

                .authorizeHttpRequests(
                        requests ->
                                requests

                                        .requestMatchers(
                                                "/resumeAnalyser/entry/v1/**",
                                                "/",
                                                "/login",
                                                "/forgotpassword",
                                                "/uploaddoc",
                                                "/analysereport",
                                                "/static/**",
                                                "/index.html",
                                                "/manifest.json",
                                                "/assets/**",
                                                "/oauth2/**",
                                                "/login/oauth2/**"
                                        )

                                        .permitAll()

                                        .anyRequest()
                                        .authenticated()
                )


                .cors(
                        cors ->
                                cors.configurationSource(
                                        corsConfigurationSource()
                                )
                )


                .csrf(
                        AbstractHttpConfigurer::disable
                )


                .logout(
                        AbstractHttpConfigurer::disable
                )


                .addFilterBefore(
                        jwtfilter,
                        UsernamePasswordAuthenticationFilter.class
                )


                .oauth2Login(
                        oauth ->
                                oauth

                                        .loginPage(
                                                "/login"
                                        )

                                        .successHandler(
                                                successHandler
                                        )

                                        .failureHandler(
                                                failureHandler
                                        )
                )


                .sessionManagement(
                        session ->
                                session

                                        .sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS
                                        )
                )


                .build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        userDetails
                );


        provider.setPasswordEncoder(
                new BCryptPasswordEncoder(12)
        );


        return provider;
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173"
                )
        );


        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS",
                        "HEAD"
                )
        );


        configuration.setAllowedHeaders(
                List.of("*")
        );


        configuration.setAllowCredentials(
                true
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}
