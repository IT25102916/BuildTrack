package com.constructiq.pattern.strategy;

/**
 * Concrete Strategy 1: Fixed Price Contract
 * Billed at a fixed agreed amount regardless of hours elapsed.
 */
public class FixedPriceStrategy implements BillingStrategy {
    private final double agreedContractPrice;

    public FixedPriceStrategy(double agreedContractPrice) {
        this.agreedContractPrice = agreedContractPrice;
    }

    @Override
    public double calculateTotalBill(double materialExpenses, int daysElapsed) {
        return agreedContractPrice;
    }

    @Override
    public String getContractType() {
        return "Fixed-Price Turnkey Contract";
    }
}
