package com.constructiq.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "quotations")
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "material_request_id", nullable = false)
    private Long materialRequestId;

    @Column(name = "supplier_id", nullable = false)
    private Long supplierId;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal price;

    @Column(name = "delivery_lead_time_days")
    private Integer deliveryLeadTimeDays;

    @Column(name = "valid_until")
    private LocalDate validUntil;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Quotation() {
    }

    public Quotation(Long id, Long materialRequestId, Long supplierId, BigDecimal price, Integer deliveryLeadTimeDays, LocalDate validUntil, String status, LocalDateTime createdAt) {
        this.id = id;
        this.materialRequestId = materialRequestId;
        this.supplierId = supplierId;
        this.price = price;
        this.deliveryLeadTimeDays = deliveryLeadTimeDays;
        this.validUntil = validUntil;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMaterialRequestId() {
        return materialRequestId;
    }

    public void setMaterialRequestId(Long materialRequestId) {
        this.materialRequestId = materialRequestId;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDeliveryLeadTimeDays() {
        return deliveryLeadTimeDays;
    }

    public void setDeliveryLeadTimeDays(Integer deliveryLeadTimeDays) {
        this.deliveryLeadTimeDays = deliveryLeadTimeDays;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
