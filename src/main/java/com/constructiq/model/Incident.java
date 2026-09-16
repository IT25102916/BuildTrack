package com.constructiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(name = "action_taken", length = 2000)
    private String actionTaken;

    @Column(nullable = false, length = 20)
    private String status = "open";

    @Column(name = "reported_by_user_id")
    private Long reportedByUserId;

    @Column(name = "reported_by_name", length = 150)
    private String reportedByName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
