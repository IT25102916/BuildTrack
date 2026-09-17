package com.constructiq.controller;

import com.constructiq.model.BudgetLine;
import com.constructiq.model.Invoice;
import com.constructiq.model.Transaction;
import com.constructiq.repository.BudgetLineRepository;
import com.constructiq.repository.InvoiceRepository;
import com.constructiq.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.constructiq.security.RequireRole;
import java.util.List;

@RestController
@RequestMapping("/api/finance")
@RequireRole({"finance", "admin"})
@SuppressWarnings("null")
public class FinanceController {

    @Autowired
    private BudgetLineRepository budgetLineRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // --- Budgets ---
    @GetMapping("/budgets/{projectId}")
    public List<BudgetLine> getBudgetsByProject(@PathVariable Long projectId) {
        return budgetLineRepository.findByProjectId(projectId);
    }

    // --- Invoices ---
    @GetMapping("/invoices")
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @PutMapping("/invoices/{id}/approve")
    public ResponseEntity<Invoice> approveInvoice(@PathVariable Long id) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow();
        invoice.setStatus("Approved");
        return ResponseEntity.ok(invoiceRepository.save(invoice));
    }

    // --- Transactions (Expenses/Payroll) ---
    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    @GetMapping("/transactions/payroll")
    public List<Transaction> getPayrollTransactions() {
        return transactionRepository.findByCategory("Payroll");
    }

    @PostMapping("/transactions")
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionRepository.save(transaction);
    }
}
