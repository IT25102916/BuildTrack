package com.constructiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rfis")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
