package com.duli.duli_social.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
public class HomeController {
    @GetMapping
    public String homeControllerHandler() {
        return "hello world";
    }
    
    @GetMapping("/home")
    public String homeControllerHandler2() {
        return "home controller 2";
    }
    
    //@PostMapping
    //@PutMapping
    //@DeleteMapping

    
}
