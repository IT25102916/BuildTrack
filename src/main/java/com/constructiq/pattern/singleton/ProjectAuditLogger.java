package com.constructiq.pattern.singleton;

/**
 * Singleton Pattern: ProjectAuditLogger
 * Ensures only ONE audit logger instance exists across the application
 * to centrally record all Project Manager actions.
 */
public class ProjectAuditLogger {

    // Volatile instance for thread-safe double-checked locking
    private static volatile ProjectAuditLogger instance;

    // Private constructor prevents external instantiation
    private ProjectAuditLogger() {}

    // Global access point
    public static ProjectAuditLogger getInstance() {
        if (instance == null) {
            synchronized (ProjectAuditLogger.class) {
                if (instance == null) {
                    instance = new ProjectAuditLogger();
                }
            }
        }
        return instance;
    }

    public void logAction(String projectManager, String action, String projectName) {
        System.out.println("[AUDIT LOG] PM " + projectManager + " performed '" + action + "' on project: " + projectName);
    }
}
