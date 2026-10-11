package com.constructiq.pattern.factory;

/**
 * Concrete Product 2: Safety Inspection Task
 */
public class SafetyInspectionTask implements ConstructionTask {
    private final String title;

    public SafetyInspectionTask(String title) {
        this.title = title;
    }

    @Override
    public String getTitle() { return title; }

    @Override
    public String getCategory() { return "Site Safety Compliance"; }

    @Override
    public String getPriority() { return "CRITICAL"; }

    @Override
    public void executeTask() {
        System.out.println("Executing safety inspection protocol for: " + title);
    }
}
