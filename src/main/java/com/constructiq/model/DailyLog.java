package com.constructiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
