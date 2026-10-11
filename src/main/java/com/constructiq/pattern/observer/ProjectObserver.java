package com.constructiq.pattern.observer;

/**
 * Observer Interface for Observer Pattern
 */
public interface ProjectObserver {
    void onStatusUpdate(String projectName, String oldStatus, String newStatus);
}
