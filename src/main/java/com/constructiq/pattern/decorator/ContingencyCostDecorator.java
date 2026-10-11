package com.constructiq.pattern.decorator;

/**
 * Concrete Decorator 1: ContingencyCostDecorator
 * Dynamically adds a 10% emergency buffer to the project budget.
 */
public class ContingencyCostDecorator extends ProjectCostDecorator {

    public ContingencyCostDecorator(ProjectCost decoratedCost) {
        super(decoratedCost);
    }

    @Override
    public double calculateCost() {
        return super.calculateCost() * 1.10; // Adds 10% safety contingency
    }

    @Override
    public String getDescription() {
        return super.getDescription() + " + 10% Contingency Buffer";
    }
}
