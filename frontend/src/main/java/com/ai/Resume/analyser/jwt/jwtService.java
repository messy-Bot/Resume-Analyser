package com.ai.Resume.analyser.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;


@Service
public class jwtService {


    private final String key;


    public jwtService(
            @Value("${jwt-key}")
            String key) {

        this.key = key;
    }


    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                key.getBytes(
                        StandardCharsets.UTF_8
                )
        );
    }


    public String generateToken(
            String email) {

        long expiration =
                System.currentTimeMillis()
                        + (20L
                        * 24
                        * 60
                        * 60
                        * 1000);


        return Jwts.builder()

                .subject(email)

                .issuedAt(
                        new Date()
                )

                .expiration(
                        new Date(
                                expiration
                        )
                )

                .signWith(
                        getSigningKey(),
                        Jwts.SIG.HS256
                )

                .compact();
    }


    public Claims extractAllClaims(
            String token) {

        return Jwts.parser()

                .verifyWith(
                        getSigningKey()
                )

                .build()

                .parseSignedClaims(
                        token
                )

                .getPayload();
    }


    public <T> T extractClaim(

            String token,

            Function<Claims, T> resolver) {

        return resolver.apply(
                extractAllClaims(token)
        );
    }


    public String getEmail(
            String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }


    public Date getExpiration(
            String token) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }


    public boolean validateToken(

            String token,

            String email) {

        try {

            return email.equals(
                    getEmail(token)
            )
                    && new Date().before(
                    getExpiration(token)
            );

        } catch (Exception exception) {

            return false;
        }
    }
}
