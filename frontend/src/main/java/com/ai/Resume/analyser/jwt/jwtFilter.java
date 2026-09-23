package com.ai.Resume.analyser.jwt;

import com.ai.Resume.analyser.configuration.entryPointService;
import com.ai.Resume.analyser.model.usersTable;
import com.ai.Resume.analyser.repository.usersTableRepo;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Service;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Service
public class jwtFilter
        extends OncePerRequestFilter {


    private final entryPointService entryService;

    private final usersTableRepo usersTableRepository;

    private final jwtService jwtservice;


    public jwtFilter(

            entryPointService entryService,

            usersTableRepo usersTableRepository,

            jwtService jwtservice) {

        this.entryService =
                entryService;

        this.usersTableRepository =
                usersTableRepository;

        this.jwtservice =
                jwtservice;
    }


    @Override
    protected void doFilterInternal(

            HttpServletRequest request,

            HttpServletResponse response,

            FilterChain filterChain)

            throws ServletException,
            IOException {


        try {

            String token =
                    getToken(request);


            if (token != null
                    &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            == null) {


                String email =
                        jwtservice.getEmail(
                                token
                        );


                usersTable user =
                        usersTableRepository
                                .findById(email)
                                .orElse(null);


                if (user != null
                        &&
                        jwtservice.validateToken(
                                token,
                                user.getEmail()
                        )) {


                    UserDetails details =
                            entryService
                                    .loadUserByUsername(
                                            user.getEmail()
                                    );


                    UsernamePasswordAuthenticationToken authentication =

                            new UsernamePasswordAuthenticationToken(

                                    details,

                                    null,

                                    details.getAuthorities()
                            );


                    authentication.setDetails(

                            new WebAuthenticationDetailsSource()
                                    .buildDetails(
                                            request
                                    )
                    );


                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                }
            }


        } catch (Exception ignored) {

            SecurityContextHolder
                    .clearContext();
        }


        filterChain.doFilter(
                request,
                response
        );
    }


    private String getToken(
            HttpServletRequest request) {


        Cookie[] cookies =
                request.getCookies();


        if (cookies == null) {

            return null;
        }


        for (Cookie cookie : cookies) {

            if ("entrypasstoken"
                    .equals(
                            cookie.getName()
                    )) {

                return cookie.getValue();
            }
        }


        return null;
    }
}
