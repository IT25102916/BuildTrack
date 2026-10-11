package com.constructiq.pattern.factory;

/**
 * Concrete Product 1: Structural Task
 */
public class StructuralTask implements ConstructionTask {
    private final String title;

    public StructuralTask(String title) {
        this.title = title;
    }

    @Override
    public String getTitle() { return title; }

    @Override
    public String getCategory() { return "Structural & Civil Works"; }

    @Override
    public String getPriority() { return "HIGH"; }

    @Override
    public void executeTask() {
        System.out.println("Executing civil work for: " + title);
    }
}
