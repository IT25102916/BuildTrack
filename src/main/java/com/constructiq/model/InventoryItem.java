package com.constructiq.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 50)
    private String unit = "EA";

    @Column(length = 100)
    private String category;

    @Column(name = "quantity_on_hand", nullable = false, precision = 14, scale = 2)
    private BigDecimal quantityOnHand = BigDecimal.ZERO;

    @Column(name = "reorder_level", nullable = false, precision = 14, scale = 2)
    private BigDecimal reorderLevel = BigDecimal.ZERO;

    @Column(name = "unit_cost", precision = 18, scale = 2)
    private BigDecimal unitCost = BigDecimal.ZERO;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public InventoryItem() {
    }

    public InventoryItem(Long id, String name, String description, String unit, String category, BigDecimal quantityOnHand, BigDecimal reorderLevel, BigDecimal unitCost, Long supplierId, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.unit = unit;
        this.category = category;
        this.quantityOnHand = quantityOnHand;
        this.reorderLevel = reorderLevel;
        this.unitCost = unitCost;
        this.supplierId = supplierId;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getQuantityOnHand() {
        return quantityOnHand;
    }

    public void setQuantityOnHand(BigDecimal quantityOnHand) {
        this.quantityOnHand = quantityOnHand;
    }

    public BigDecimal getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(BigDecimal reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
