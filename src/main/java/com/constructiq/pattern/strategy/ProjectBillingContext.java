package com.constructiq.pattern.strategy;

/**
 * Context class for Strategy Pattern
 * Maintains a reference to a BillingStrategy and allows the Project Manager
 * to swap strategies at runtime.
 */
public class ProjectBillingContext {
    private BillingStrategy strategy;

    public ProjectBillingContext(BillingStrategy initialStrategy) {
        this.strategy = initialStrategy;
    }

    public void setStrategy(BillingStrategy strategy) {
        this.strategy = strategy;
    }

    public double calculateBill(double materialExpenses, int daysElapsed) {
        if (strategy == null) {
            throw new IllegalStateException("Billing strategy is not set.");
        }
        return strategy.calculateTotalBill(materialExpenses, daysElapsed);
    }

    public String getCurrentContractType() {
        return strategy != null ? strategy.getContractType() : "No Strategy Assigned";
    }
}
