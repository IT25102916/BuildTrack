package com.constructiq.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "punch_items")
public class PunchItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "has_photo", nullable = false)
    private boolean hasPhoto = false;

    @Column(name = "responsible_party", length = 255)
    private String responsibleParty;

    @Column(nullable = false, length = 30)
    private String status = "open";

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "opened_date", nullable = false)
    private LocalDate openedDate = LocalDate.now();

    @Column(name = "closed_date")
    private LocalDate closedDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public PunchItem() {
    }

    public PunchItem(Long id, Long projectId, String location, String description, boolean hasPhoto, String responsibleParty, String status, LocalDate dueDate, LocalDate openedDate, LocalDate closedDate, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.location = location;
        this.description = description;
        this.hasPhoto = hasPhoto;
        this.responsibleParty = responsibleParty;
        this.status = status;
        this.dueDate = dueDate;
        this.openedDate = openedDate;
        this.closedDate = closedDate;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isHasPhoto() {
        return hasPhoto;
    }

    public void setHasPhoto(boolean hasPhoto) {
        this.hasPhoto = hasPhoto;
    }

    public String getResponsibleParty() {
        return responsibleParty;
    }

    public void setResponsibleParty(String responsibleParty) {
        this.responsibleParty = responsibleParty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getOpenedDate() {
        return openedDate;
    }

    public void setOpenedDate(LocalDate openedDate) {
        this.openedDate = openedDate;
    }

    public LocalDate getClosedDate() {
        return closedDate;
    }

    public void setClosedDate(LocalDate closedDate) {
        this.closedDate = closedDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
