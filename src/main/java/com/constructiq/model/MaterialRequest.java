package com.constructiq.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_requests")
public class MaterialRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "material_description", nullable = false, length = 500)
    private String materialDescription;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantity = BigDecimal.ZERO;

    @Column(nullable = false, length = 20)
    private String unit = "EA";

    @Column(name = "requested_by_user_id")
    private Long requestedByUserId;

    @Column(name = "requested_by_name", length = 150)
    private String requestedByName;

    @Column(nullable = false, length = 30)
    private String status = "pending";

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate = LocalDate.now();

    @Column(length = 1000)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public MaterialRequest() {
    }

    public MaterialRequest(Long id, Long projectId, String materialDescription, BigDecimal quantity, String unit, Long requestedByUserId, String requestedByName, String status, LocalDate requestDate, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.materialDescription = materialDescription;
        this.quantity = quantity;
        this.unit = unit;
        this.requestedByUserId = requestedByUserId;
        this.requestedByName = requestedByName;
        this.status = status;
        this.requestDate = requestDate;
        this.notes = notes;
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

    public String getMaterialDescription() {
        return materialDescription;
    }

    public void setMaterialDescription(String materialDescription) {
        this.materialDescription = materialDescription;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Long getRequestedByUserId() {
        return requestedByUserId;
    }

    public void setRequestedByUserId(Long requestedByUserId) {
        this.requestedByUserId = requestedByUserId;
    }

    public String getRequestedByName() {
        return requestedByName;
    }

    public void setRequestedByName(String requestedByName) {
        this.requestedByName = requestedByName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
