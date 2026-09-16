package com.constructiq.controller;

import com.constructiq.model.Transaction;
import com.constructiq.repository.TransactionRepository;
import com.constructiq.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/administrative")
    public ResponseEntity<String> getAdministrativeReport() {
        String csvContent = "ReportType,Status,Count\nEmployees,Active,24\nProjects,Ongoing,5\nContractors,Registered,12\n";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "admin_report.csv");
        
        return new ResponseEntity<>(csvContent, headers, HttpStatus.OK);
    }

    @GetMapping("/financial")
    public ResponseEntity<String> getFinancialReport() {
        StringBuilder csv = new StringBuilder();
        csv.append("Transaction ID,Category,Amount,Date\n");

        for (Transaction t : transactionRepository.findAll()) {
            csv.append(t.getId()).append(",")
               .append(t.getCategory()).append(",")
               .append(t.getAmount()).append(",")
               .append(t.getTransactionDate()).append("\n");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=financial_report.csv");
        headers.add("Content-Type", "text/csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
}
