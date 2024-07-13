package com.trail.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/* Just a buffer class to check if backend has basic functionality */

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Trail Buddy Default Home Page.";
    }

}
