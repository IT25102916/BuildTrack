package com.constructiq.pattern.decorator;

/**
 * Base Decorator class
 */
public abstract class ProjectCostDecorator implements ProjectCost {
    protected final ProjectCost decoratedCost;

    public ProjectCostDecorator(ProjectCost decoratedCost) {
        this.decoratedCost = decoratedCost;
    }

    @Override
    public double calculateCost() {
        return decoratedCost.calculateCost();
    }

    @Override
    public String getDescription() {
        return decoratedCost.getDescription();
    }
}
