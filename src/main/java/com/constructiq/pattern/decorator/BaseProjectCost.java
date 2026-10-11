package com.constructiq.pattern.decorator;

/**
 * Concrete Component: BaseProjectCost
 * Represents raw baseline construction costs estimated by the PM.
 */
public class BaseProjectCost implements ProjectCost {
    private final double baseBudget;

    public BaseProjectCost(double baseBudget) {
        this.baseBudget = baseBudget;
    }

    @Override
    public double calculateCost() {
        return baseBudget;
    }

    @Override
    public String getDescription() {
        return "Base Project Budget";
    }
}
