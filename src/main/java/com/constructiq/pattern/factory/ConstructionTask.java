package com.constructiq.pattern.factory;

/**
 * Product interface for Factory Pattern
 */
public interface ConstructionTask {
    String getTitle();
    String getCategory();
    String getPriority();
    void executeTask();
}
