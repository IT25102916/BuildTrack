package com.constructiq.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_logs")
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(length = 30)
    private String weather;

    @Column(length = 20)
    private String temperature;

    @Column(name = "manpower_count", nullable = false)
    private int manpowerCount = 0;

    @Column(name = "work_performed", length = 2000)
    private String workPerformed;

    @Column(length = 1000)
    private String delays;

    @Column(name = "is_signed", nullable = false)
    private boolean isSigned = false;

    @Column(name = "signed_by_user_id")
    private Long signedByUserId;

    @Column(name = "signed_by_name", length = 150)
    private String signedByName;

    @Column(name = "photo_count", nullable = false)
    private int photoCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public DailyLog() {
    }

    public DailyLog(Long id, Long projectId, LocalDate logDate, String weather, String temperature, int manpowerCount, String workPerformed, String delays, boolean isSigned, Long signedByUserId, String signedByName, int photoCount, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.logDate = logDate;
        this.weather = weather;
        this.temperature = temperature;
        this.manpowerCount = manpowerCount;
        this.workPerformed = workPerformed;
        this.delays = delays;
        this.isSigned = isSigned;
        this.signedByUserId = signedByUserId;
        this.signedByName = signedByName;
        this.photoCount = photoCount;
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

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public String getWeather() {
        return weather;
    }

    public void setWeather(String weather) {
        this.weather = weather;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public int getManpowerCount() {
        return manpowerCount;
    }

    public void setManpowerCount(int manpowerCount) {
        this.manpowerCount = manpowerCount;
    }

    public String getWorkPerformed() {
        return workPerformed;
    }

    public void setWorkPerformed(String workPerformed) {
        this.workPerformed = workPerformed;
    }

    public String getDelays() {
        return delays;
    }

    public void setDelays(String delays) {
        this.delays = delays;
    }

    public boolean isIsSigned() {
        return isSigned;
    }

    public void setSigned(boolean isSigned) {
        this.isSigned = isSigned;
    }

    public Long getSignedByUserId() {
        return signedByUserId;
    }

    public void setSignedByUserId(Long signedByUserId) {
        this.signedByUserId = signedByUserId;
    }

    public String getSignedByName() {
        return signedByName;
    }

    public void setSignedByName(String signedByName) {
        this.signedByName = signedByName;
    }

    public int getPhotoCount() {
        return photoCount;
    }

    public void setPhotoCount(int photoCount) {
        this.photoCount = photoCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
