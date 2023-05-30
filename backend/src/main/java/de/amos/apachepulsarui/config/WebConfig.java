/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Jonas Arnhold <jonasarnhold@web.de>
 */

package de.amos.apachepulsarui.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*");
    }

}
