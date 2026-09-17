package com.constructiq.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "submittals")
public class Submittal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "submittal_number", nullable = false, length = 20)
    private String submittalNumber;

    @Column(name = "spec_section", nullable = false, length = 10)
    private String specSection;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false, length = 30)
    private String status = "pending";

    @Column(name = "submitted_by_user_id")
    private Long submittedByUserId;

    @Column(name = "submitted_by_name", length = 150)
    private String submittedByName;

    @Column(name = "reviewed_by", length = 255)
    private String reviewedBy;

    @Column(name = "submitted_date", nullable = false)
    private LocalDate submittedDate = LocalDate.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Submittal() {
    }

    public Submittal(Long id, Long projectId, String submittalNumber, String specSection, String description, String status, Long submittedByUserId, String submittedByName, String reviewedBy, LocalDate submittedDate, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.submittalNumber = submittalNumber;
        this.specSection = specSection;
        this.description = description;
        this.status = status;
        this.submittedByUserId = submittedByUserId;
        this.submittedByName = submittedByName;
        this.reviewedBy = reviewedBy;
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

    public String getSubmittalNumber() {
        return submittalNumber;
    }

    public void setSubmittalNumber(String submittalNumber) {
        this.submittalNumber = submittalNumber;
    }

    public String getSpecSection() {
        return specSection;
    }

    public void setSpecSection(String specSection) {
        this.specSection = specSection;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
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
