package com.constructiq.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budget_lines")
public class BudgetLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "cost_code", nullable = false, length = 20)
    private String costCode;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(name = "budgeted_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal budgetedAmount = BigDecimal.ZERO;

    @Column(name = "committed_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal committedAmount = BigDecimal.ZERO;

    @Column(name = "actual_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal actualAmount = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public BudgetLine() {
    }

    public BudgetLine(Long id, Long projectId, String costCode, String description, BigDecimal budgetedAmount, BigDecimal committedAmount, BigDecimal actualAmount, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.costCode = costCode;
        this.description = description;
        this.budgetedAmount = budgetedAmount;
        this.committedAmount = committedAmount;
        this.actualAmount = actualAmount;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getCostCode() {
        return costCode;
    }

    public void setCostCode(String costCode) {
        this.costCode = costCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBudgetedAmount() {
        return budgetedAmount;
    }

    public void setBudgetedAmount(BigDecimal budgetedAmount) {
        this.budgetedAmount = budgetedAmount;
    }

    public BigDecimal getCommittedAmount() {
        return committedAmount;
    }

    public void setCommittedAmount(BigDecimal committedAmount) {
        this.committedAmount = committedAmount;
    }

    public BigDecimal getActualAmount() {
        return actualAmount;
    }

    public void setActualAmount(BigDecimal actualAmount) {
        this.actualAmount = actualAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
