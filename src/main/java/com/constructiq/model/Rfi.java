package com.constructiq.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rfis")
public class Rfi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "rfi_number", nullable = false, length = 20)
    private String rfiNumber;

    @Column(nullable = false, length = 500)
    private String subject;

    @Column(nullable = false, length = 30)
    private String status = "open";

    @Column(name = "submitted_by_user_id")
    private Long submittedByUserId;

    @Column(name = "submitted_by_name", length = 150)
    private String submittedByName;

    @Column(name = "assigned_to", length = 255)
    private String assignedTo;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "ball_in_court", length = 255)
    private String ballInCourt;

    @Column(length = 2000)
    private String response;

    @Column(name = "submitted_date", nullable = false)
    private LocalDate submittedDate = LocalDate.now();

    @Column(name = "task_id")
    private Long taskId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Rfi() {
    }

    public Rfi(Long id, Long projectId, String rfiNumber, String subject, String status, Long submittedByUserId, String submittedByName, String assignedTo, LocalDate dueDate, String ballInCourt, String response, LocalDate submittedDate, Long taskId, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.rfiNumber = rfiNumber;
        this.subject = subject;
        this.status = status;
        this.submittedByUserId = submittedByUserId;
        this.submittedByName = submittedByName;
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.ballInCourt = ballInCourt;
        this.response = response;
        this.submittedDate = submittedDate;
        this.taskId = taskId;
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

    public String getRfiNumber() {
        return rfiNumber;
    }

    public void setRfiNumber(String rfiNumber) {
        this.rfiNumber = rfiNumber;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
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

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getBallInCourt() {
        return ballInCourt;
    }

    public void setBallInCourt(String ballInCourt) {
        this.ballInCourt = ballInCourt;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public LocalDate getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(LocalDate submittedDate) {
        this.submittedDate = submittedDate;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
