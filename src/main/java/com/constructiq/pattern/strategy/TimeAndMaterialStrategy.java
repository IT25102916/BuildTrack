package com.constructiq.pattern.strategy;

/**
 * Concrete Strategy 2: Time and Materials Contract
 * Billed based on actual material costs + daily labor/machinery rate.
 */
public class TimeAndMaterialStrategy implements BillingStrategy {
    private final double dailyLaborAndEquipmentRate;

    public TimeAndMaterialStrategy(double dailyLaborAndEquipmentRate) {
        this.dailyLaborAndEquipmentRate = dailyLaborAndEquipmentRate;
    }

    @Override
    public double calculateTotalBill(double materialExpenses, int daysElapsed) {
        return materialExpenses + (daysElapsed * dailyLaborAndEquipmentRate);
    }

    @Override
    public String getContractType() {
        return "Time & Materials (T&M) Contract";
    }
}
