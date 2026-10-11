package com.constructiq.pattern.observer;

/**
 * Concrete Observer 1: SiteEngineerNotifier
 * Alerts field engineers on mobile/dashboard when project milestones change.
 */
public class SiteEngineerNotifier implements ProjectObserver {

    @Override
    public void onStatusUpdate(String projectName, String oldStatus, String newStatus) {
        System.out.println("[OBSERVER: SITE ENGINEER] Alert: Project '" + projectName 
                + "' status changed from " + oldStatus + " to " + newStatus 
                + ". Updating on-site schedule.");
    }
}
