package com.constructiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
