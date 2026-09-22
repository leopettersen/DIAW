package com.example.RadioBrowserAPI.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class SupabaseConfig {
    @Value("${supabase.url}") private String url;
    @Value("${supabase.service-key}") private String serviceKey;

    public String getUrl() {
        return url;
    }

    public String getServiceKey() {
        return serviceKey;
    }
}