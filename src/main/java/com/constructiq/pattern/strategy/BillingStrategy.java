package com.constructiq.pattern.strategy;

/**
 * Strategy Pattern: BillingStrategy Interface
 * Defines interchangeable contract billing algorithms for Project Managers.
 */
public interface BillingStrategy {
    double calculateTotalBill(double materialExpenses, int daysElapsed);
    String getContractType();
}
