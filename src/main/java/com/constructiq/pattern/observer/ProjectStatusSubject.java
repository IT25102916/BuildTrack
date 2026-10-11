package com.constructiq.pattern.observer;

import java.util.ArrayList;
import java.util.List;

/**
 * Subject (Observable) for Observer Pattern
 * Manages observers and notifies them whenever the Project Manager updates project status.
 */
public class ProjectStatusSubject {

    private final List<ProjectObserver> observers = new ArrayList<>();

    public void attach(ProjectObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
        }
    }

    public void detach(ProjectObserver observer) {
        observers.remove(observer);
    }

    public void notifyObservers(String projectName, String oldStatus, String newStatus) {
        for (ProjectObserver observer : observers) {
            observer.onStatusUpdate(projectName, oldStatus, newStatus);
        }
    }
}
