package com.constructiq.pattern.factory;

/**
 * Factory Pattern: ProjectTaskFactory
 * Allows the Project Manager to instantiate specific construction tasks
 * without exposing the instantiation logic to the client.
 */
public class ProjectTaskFactory {

    public static ConstructionTask createTask(String taskType, String title) {
        if (taskType == null || taskType.trim().isEmpty()) {
            throw new IllegalArgumentException("Task type cannot be empty.");
        }

        switch (taskType.toUpperCase().trim()) {
            case "STRUCTURAL":
                return new StructuralTask(title);
            case "SAFETY":
                return new SafetyInspectionTask(title);
            default:
                throw new IllegalArgumentException("Unknown task type: " + taskType);
        }
    }
}
