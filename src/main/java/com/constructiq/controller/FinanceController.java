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

    @PostMapping("/invoices")
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    @PutMapping("/invoices/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id, @RequestBody Invoice updates) {
        return invoiceRepository.findById(id).map(inv -> {
            if (updates.getProjectId() != null) inv.setProjectId(updates.getProjectId());
            if (updates.getSupplierId() != null) inv.setSupplierId(updates.getSupplierId());
            if (updates.getInvoiceNumber() != null) inv.setInvoiceNumber(updates.getInvoiceNumber());
            if (updates.getAmount() != null) inv.setAmount(updates.getAmount());
            if (updates.getDueDate() != null) inv.setDueDate(updates.getDueDate());
            if (updates.getStatus() != null) inv.setStatus(updates.getStatus());
            return ResponseEntity.ok(invoiceRepository.save(inv));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/invoices/{id}/approve")
    public ResponseEntity<Invoice> approveInvoice(@PathVariable Long id) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow();
        invoice.setStatus("Approved");
        return ResponseEntity.ok(invoiceRepository.save(invoice));
    }

    @DeleteMapping("/invoices/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        if (!invoiceRepository.existsById(id)) return ResponseEntity.notFound().build();
        invoiceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- Transactions (Expenses/Payroll) ---
    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    @GetMapping("/transactions/payroll")
    public List<Transaction> getPayrollTransactions() {
        List<Transaction> payrolls = transactionRepository.findByType("PAYROLL");
        if (payrolls.isEmpty()) {
            payrolls = transactionRepository.findByCategory("Payroll");
        }
        return payrolls;
    }

    @PostMapping("/transactions")
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @PutMapping("/transactions/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction updates) {
        return transactionRepository.findById(id).map(t -> {
            if (updates.getProjectId() != null) t.setProjectId(updates.getProjectId());
            if (updates.getType() != null) t.setType(updates.getType());
            if (updates.getCategory() != null) t.setCategory(updates.getCategory());
            if (updates.getAmount() != null) t.setAmount(updates.getAmount());
            if (updates.getTransactionDate() != null) t.setTransactionDate(updates.getTransactionDate());
            if (updates.getDescription() != null) t.setDescription(updates.getDescription());
            return ResponseEntity.ok(transactionRepository.save(t));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        if (!transactionRepository.existsById(id)) return ResponseEntity.notFound().build();
        transactionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
