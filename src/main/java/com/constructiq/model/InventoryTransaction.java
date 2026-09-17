package com.constructiq.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inventory_item_id", nullable = false)
    private Long inventoryItemId;

    @Column(name = "project_id")
    private Long projectId;

    /** RECEIPT or ISSUE */
    @Column(nullable = false, length = 20)
    private String type;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal quantity = BigDecimal.ZERO;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate = LocalDate.now();

    @Column(length = 500)
    private String notes;

    @Column(name = "performed_by_user_id")
    private Long performedByUserId;

    @Column(name = "performed_by_name", length = 150)
    private String performedByName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public InventoryTransaction() {
    }

    public InventoryTransaction(Long id, Long inventoryItemId, Long projectId, String type, BigDecimal quantity, LocalDate transactionDate, String notes, Long performedByUserId, String performedByName, LocalDateTime createdAt) {
        this.id = id;
        this.inventoryItemId = inventoryItemId;
        this.projectId = projectId;
        this.type = type;
        this.quantity = quantity;
        this.transactionDate = transactionDate;
        this.notes = notes;
        this.performedByUserId = performedByUserId;
        this.performedByName = performedByName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInventoryItemId() {
        return inventoryItemId;
    }

    public void setInventoryItemId(Long inventoryItemId) {
        this.inventoryItemId = inventoryItemId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getPerformedByUserId() {
        return performedByUserId;
    }

    public void setPerformedByUserId(Long performedByUserId) {
        this.performedByUserId = performedByUserId;
    }

    public String getPerformedByName() {
        return performedByName;
    }

    public void setPerformedByName(String performedByName) {
        this.performedByName = performedByName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
