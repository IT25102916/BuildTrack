package com.constructiq.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "change_orders")
public class ChangeOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "cost_impact", nullable = false, precision = 18, scale = 2)
    private BigDecimal costImpact = BigDecimal.ZERO;

    @Column(name = "schedule_impact_days", nullable = false)
    private int scheduleImpactDays = 0;

    @Column(nullable = false, length = 30)
    private String status = "pending";

    @Column(name = "submitted_by_user_id")
    private Long submittedByUserId;

    @Column(name = "submitted_by_name", length = 150)
    private String submittedByName;

    @Column(name = "submitted_date", nullable = false)
    private LocalDate submittedDate = LocalDate.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ChangeOrder() {
    }

    public ChangeOrder(Long id, Long projectId, String description, BigDecimal costImpact, int scheduleImpactDays, String status, Long submittedByUserId, String submittedByName, LocalDate submittedDate, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.description = description;
        this.costImpact = costImpact;
        this.scheduleImpactDays = scheduleImpactDays;
        this.status = status;
        this.submittedByUserId = submittedByUserId;
        this.submittedByName = submittedByName;
        this.submittedDate = submittedDate;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getCostImpact() {
        return costImpact;
    }

    public void setCostImpact(BigDecimal costImpact) {
        this.costImpact = costImpact;
    }

    public int getScheduleImpactDays() {
        return scheduleImpactDays;
    }

    public void setScheduleImpactDays(int scheduleImpactDays) {
        this.scheduleImpactDays = scheduleImpactDays;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getSubmittedByUserId() {
        return submittedByUserId;
    }

    public void setSubmittedByUserId(Long submittedByUserId) {
        this.submittedByUserId = submittedByUserId;
    }

    public String getSubmittedByName() {
        return submittedByName;
    }

    public void setSubmittedByName(String submittedByName) {
        this.submittedByName = submittedByName;
    }

    public LocalDate getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(LocalDate submittedDate) {
        this.submittedDate = submittedDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
