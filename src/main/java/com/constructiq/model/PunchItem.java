package com.constructiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "punch_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
