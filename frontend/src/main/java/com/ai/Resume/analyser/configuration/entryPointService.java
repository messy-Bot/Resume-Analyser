package com.ai.Resume.analyser.configuration;

import com.ai.Resume.analyser.model.usersTable;
import com.ai.Resume.analyser.repository.usersTableRepo;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;


@Service
public class entryPointService
        implements UserDetailsService {

    private final usersTableRepo usersTableRepository;


    public entryPointService(
            usersTableRepo usersTableRepository) {

        this.usersTableRepository =
                usersTableRepository;
    }


    @Override
    public UserDetails loadUserByUsername(
            String username)
            throws UsernameNotFoundException {

        usersTable user =
                usersTableRepository
                        .findById(username)
                        .orElseThrow(
                                () ->
                                        new UsernameNotFoundException(
                                                "User not found"
                                        )
                        );


        return User.builder()
                .username(user.getEmail())
                .password(
                        user.getPassword() == null
                                ? ""
                                : user.getPassword()
                )
                .roles("USER")
                .build();
    }
}
