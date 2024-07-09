package com.trail.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Trail Buddy Default Home Page.";
    }

    @GetMapping("/secured")
    public String secured() {
        return "Hello, Secured";
    }

}
