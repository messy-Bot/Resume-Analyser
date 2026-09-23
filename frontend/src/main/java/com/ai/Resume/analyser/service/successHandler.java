package com.ai.Resume.analyser.service;

import com.ai.Resume.analyser.jwt.jwtService;
import com.ai.Resume.analyser.model.usersTable;
import com.ai.Resume.analyser.repository.usersTableRepo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;


@Component
public class successHandler
        implements AuthenticationSuccessHandler {


    private final usersTableRepo usersTableRepository;

    private final jwtService jwtService;

    private final boolean secureCookie;


    public successHandler(

            usersTableRepo usersTableRepository,

            jwtService jwtService,

            @Value("${app.cookie.secure:false}")
            boolean secureCookie) {

        this.usersTableRepository =
                usersTableRepository;

        this.jwtService =
                jwtService;

        this.secureCookie =
                secureCookie;
    }


    @Override
    public void onAuthenticationSuccess(

            HttpServletRequest request,

            HttpServletResponse response,

            Authentication authentication)

            throws IOException {


        OAuth2User oauthUser =
                (OAuth2User)
                        authentication.getPrincipal();


        Map<String, Object> data =
                oauthUser.getAttributes();


        String email =
                String.valueOf(
                        data.get("email")
                );


        String name =
                String.valueOf(
                        data.get("name")
                );


        if (!usersTableRepository
                .existsById(email)) {


            usersTableRepository.save(

                    usersTable.builder()

                            .username(name)

                            .email(email)

                            .password("")

                            .resetExpiration(null)

                            .previousResults(false)

                            .resetOtp(null)

                            .build()
            );
        }


        String token =
                jwtService.generateToken(
                        email
                );


        ResponseCookie cookie =
                ResponseCookie

                        .from(
                                "entrypasstoken",
                                token
                        )

                        .path("/")

                        .httpOnly(true)

                        .secure(
                                secureCookie
                        )

                        .sameSite("Lax")

                        .maxAge(
                                20L
                                * 24
                                * 60
                                * 60
                        )

                        .build();


        response.addHeader(

                "Set-Cookie",

                cookie.toString()
        );


        response.sendRedirect("/");
    }
}
