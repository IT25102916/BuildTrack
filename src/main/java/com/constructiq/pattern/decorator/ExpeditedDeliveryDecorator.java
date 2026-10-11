package com.constructiq.pattern.decorator;

/**
 * Concrete Decorator 2: ExpeditedDeliveryDecorator
 * Dynamically adds fast-track overtime charges ($25,000) for accelerated milestones.
 */
public class ExpeditedDeliveryDecorator extends ProjectCostDecorator {

    public ExpeditedDeliveryDecorator(ProjectCost decoratedCost) {
        super(decoratedCost);
    }

    @Override
    public double calculateCost() {
        return super.calculateCost() + 25000.0;
    }

    @Override
    public String getDescription() {
        return super.getDescription() + " + Expedited Delivery Overtime Fee";
    }
}
