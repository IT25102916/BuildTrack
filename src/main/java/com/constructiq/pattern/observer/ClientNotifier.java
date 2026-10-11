package com.constructiq.pattern.observer;

/**
 * Concrete Observer 2: ClientNotifier
 * Dispatches automated milestone emails to the client stakeholder.
 */
public class ClientNotifier implements ProjectObserver {

    @Override
    public void onStatusUpdate(String projectName, String oldStatus, String newStatus) {
        System.out.println("[OBSERVER: CLIENT] Email dispatched to client: Project '" + projectName 
                + "' has entered state: " + newStatus);
    }
}
