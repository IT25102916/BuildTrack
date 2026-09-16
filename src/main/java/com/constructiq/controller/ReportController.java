package com.constructiq.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @GetMapping("/administrative")
    public ResponseEntity<String> getAdministrativeReport() {
        String csvContent = "ReportType,Status,Count\nEmployees,Active,24\nProjects,Ongoing,5\nContractors,Registered,12\n";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "admin_report.csv");
        
        return new ResponseEntity<>(csvContent, headers, HttpStatus.OK);
    }
}
