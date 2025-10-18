package com.duli.duli_social.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class AppConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.sessionManagement(
            Management -> Management.sessionCreationPolicy(
                SessionCreationPolicy.STATELESS))   //không dùng session, đảm bảo mỗi request tự chứa thông tin xác thực riêng
        .authorizeHttpRequests( //phân quyền truy cập, bắt đầu bằng /api/** thì cần xác thực 
            Authorize -> Authorize.requestMatchers("/api/**")
                .authenticated()
                .anyRequest().permitAll())  //còn lại thì cho phép đi qua
                .addFilterBefore(new JwtValidator(), BasicAuthenticationFilter.class)
        .csrf(csrf -> csrf.disable());  //do đã tắt session ở trên nên không cần bật chế độ bảo vệ csrf

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
