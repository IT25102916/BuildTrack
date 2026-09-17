package com.constructiq.controller;

import com.constructiq.model.Transaction;
import com.constructiq.model.PurchaseOrder;
import com.constructiq.model.Project;
import com.constructiq.model.Task;
import com.constructiq.model.BudgetLine;
import com.constructiq.repository.PurchaseOrderRepository;
import com.constructiq.repository.TransactionRepository;
import com.constructiq.repository.ProjectRepository;
import com.constructiq.repository.TaskRepository;
import com.constructiq.repository.BudgetLineRepository;
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
@SuppressWarnings("null")
public class ReportController {


    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BudgetLineRepository budgetLineRepository;

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

    @GetMapping("/procurement")
    public ResponseEntity<String> getProcurementReport() {
        StringBuilder csv = new StringBuilder();
        csv.append("Purchase Order ID,Project ID,Supplier Name,Description,Amount,Status,Order Date\n");

        for (PurchaseOrder po : purchaseOrderRepository.findAll()) {
            csv.append(po.getId()).append(",")
               .append(po.getProjectId()).append(",")
               .append(po.getSupplierName() != null ? po.getSupplierName().replace(",", " ") : "").append(",")
               .append(po.getDescription() != null ? po.getDescription().replace(",", " ") : "").append(",")
               .append(po.getAmount()).append(",")
               .append(po.getStatus()).append(",")
               .append(po.getOrderDate()).append("\n");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=procurement_report.csv");
        headers.add("Content-Type", "text/csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<String> getProjectReport(@org.springframework.web.bind.annotation.PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return ResponseEntity.notFound().build();
        }

        StringBuilder csv = new StringBuilder();
        // Project Overview
        csv.append("--- PROJECT OVERVIEW ---\n");
        csv.append("Project ID,Name,Status,Start Date,End Date,Budget\n");
        csv.append(project.getId()).append(",")
           .append(project.getName() != null ? project.getName().replace(",", " ") : "").append(",")
           .append(project.getStatus()).append(",")
           .append(project.getStartDate()).append(",")
           .append(project.getEndDate()).append(",")
           .append(project.getBudget()).append("\n\n");

        // Tasks Overview
        csv.append("--- TASKS ---\n");
        csv.append("Task ID,Name,Status,Percent Complete,Start Date,End Date,Assigned To\n");
        for (Task task : taskRepository.findByProjectId(projectId)) {
            csv.append(task.getId()).append(",")
               .append(task.getName() != null ? task.getName().replace(",", " ") : "").append(",")
               .append(task.getStatus()).append(",")
               .append(task.getPercentComplete()).append("%,")
               .append(task.getStartDate()).append(",")
               .append(task.getEndDate()).append(",")
               .append(task.getAssignedName() != null ? task.getAssignedName().replace(",", " ") : "").append("\n");
        }
        
        // Budget Overview
        csv.append("\n--- BUDGET ---\n");
        csv.append("Cost Code,Description,Budgeted,Committed,Actual\n");
        for (BudgetLine bl : budgetLineRepository.findByProjectId(projectId)) {
            csv.append(bl.getCostCode()).append(",")
               .append(bl.getDescription() != null ? bl.getDescription().replace(",", " ") : "").append(",")
               .append(bl.getBudgetedAmount()).append(",")
               .append(bl.getCommittedAmount()).append(",")
               .append(bl.getActualAmount()).append("\n");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=project_" + projectId + "_report.csv");
        headers.add("Content-Type", "text/csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
}
