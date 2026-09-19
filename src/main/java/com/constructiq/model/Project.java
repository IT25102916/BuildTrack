package com.constructiq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "projects")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Project name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String address;

    @NotNull(message = "Start date is required")
    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @NotBlank(message = "Status is required")
    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String type = "Commercial";

    @Column(precision = 18, scale = 2)
    private java.math.BigDecimal budget;

    @Column(name = "client_id")
    private Long clientId;

    @Column(name = "client_name")
    private String clientName;

    @Column(name = "contract_value", precision = 18, scale = 2)
    private java.math.BigDecimal contractValue = java.math.BigDecimal.ZERO;

    @Column(name = "approved_budget", precision = 18, scale = 2)
    private java.math.BigDecimal approvedBudget = java.math.BigDecimal.ZERO;

    @Column(name = "percent_complete")
    private int percentComplete = 0;

    @Column(name = "budget_health", length = 20)
    private String budgetHealth = "good";

    @Column(name = "manpower_today")
    private int manpowerToday = 0;

    @Column(name = "open_rfis")
    private int openRfis = 0;

    @Column(name = "open_punch")
    private int openPunch = 0;

    @Column(length = 10)
    private String color = "#00d4b4";

    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    public Project() {
    }

    public Project(Long id, String name, String address, LocalDate startDate, LocalDate endDate, String status, String type) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public java.math.BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(java.math.BigDecimal budget) {
        this.budget = budget;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public java.math.BigDecimal getContractValue() {
        return contractValue;
    }

    public void setContractValue(java.math.BigDecimal contractValue) {
        this.contractValue = contractValue;
    }

    public java.math.BigDecimal getApprovedBudget() {
        return approvedBudget;
    }

    public void setApprovedBudget(java.math.BigDecimal approvedBudget) {
        this.approvedBudget = approvedBudget;
    }

    public int getPercentComplete() {
        return percentComplete;
    }

    public void setPercentComplete(int percentComplete) {
        this.percentComplete = percentComplete;
    }

    public String getBudgetHealth() {
        return budgetHealth;
    }

    public void setBudgetHealth(String budgetHealth) {
        this.budgetHealth = budgetHealth;
    }

    public int getManpowerToday() {
        return manpowerToday;
    }

    public void setManpowerToday(int manpowerToday) {
        this.manpowerToday = manpowerToday;
    }

    public int getOpenRfis() {
        return openRfis;
    }

    public void setOpenRfis(int openRfis) {
        this.openRfis = openRfis;
    }

    public int getOpenPunch() {
        return openPunch;
    }

    public void setOpenPunch(int openPunch) {
        this.openPunch = openPunch;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
