package com.constructiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "change_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangeOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "cost_impact", nullable = false, precision = 18, scale = 2)
    private BigDecimal costImpact = BigDecimal.ZERO;

    @Column(name = "schedule_impact_days", nullable = false)
    private int scheduleImpactDays = 0;

    @Column(nullable = false, length = 30)
    private String status = "pending";

    @Column(name = "submitted_by_user_id")
    private Long submittedByUserId;

    @Column(name = "submitted_by_name", length = 150)
    private String submittedByName;

    @Column(name = "submitted_date", nullable = false)
    private LocalDate submittedDate = LocalDate.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
