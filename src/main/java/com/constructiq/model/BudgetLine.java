package com.constructiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budget_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "cost_code", nullable = false, length = 20)
    private String costCode;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(name = "budgeted_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal budgetedAmount = BigDecimal.ZERO;

    @Column(name = "committed_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal committedAmount = BigDecimal.ZERO;

    @Column(name = "actual_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal actualAmount = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
