package com.constructiq.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "is_milestone", nullable = false)
    private boolean isMilestone = false;

    @Column(name = "is_critical", nullable = false)
    private boolean isCritical = false;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "percent_complete", nullable = false)
    private int percentComplete = 0;

    @Column(nullable = false, length = 30)
    private String status = "pending";

    @Column(name = "assigned_user_id")
    private Long assignedUserId;

    @Column(name = "assigned_name", length = 150)
    private String assignedName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Task() {
    }

    public Task(Long id, Long projectId, String name, Long parentId, boolean isMilestone, boolean isCritical, LocalDate startDate, LocalDate endDate, int percentComplete, String status, Long assignedUserId, String assignedName, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.name = name;
        this.parentId = parentId;
        this.isMilestone = isMilestone;
        this.isCritical = isCritical;
        this.startDate = startDate;
        this.endDate = endDate;
        this.percentComplete = percentComplete;
        this.status = status;
        this.assignedUserId = assignedUserId;
        this.assignedName = assignedName;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public boolean isIsMilestone() {
        return isMilestone;
    }

    public void setMilestone(boolean isMilestone) {
        this.isMilestone = isMilestone;
    }

    public boolean isIsCritical() {
        return isCritical;
    }

    public void setCritical(boolean isCritical) {
        this.isCritical = isCritical;
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

    public int getPercentComplete() {
        return percentComplete;
    }

    public void setPercentComplete(int percentComplete) {
        this.percentComplete = percentComplete;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    public String getAssignedName() {
        return assignedName;
    }

    public void setAssignedName(String assignedName) {
        this.assignedName = assignedName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
