package com.constructiq.service;

import com.constructiq.exception.ResourceNotFoundException;
import com.constructiq.model.Project;
import com.constructiq.model.ProjectAssignment;
import com.constructiq.repository.ProjectAssignmentRepository;
import com.constructiq.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, ProjectAssignmentRepository projectAssignmentRepository) {
        this.projectRepository = projectRepository;
        this.projectAssignmentRepository = projectAssignmentRepository;
    }

    public List<Project> getAllProjects(Long userId, String role) {
        if ("admin".equals(role) || "procurement".equals(role) || "inventory_manager".equals(role) || role.contains("finance")) {
            return projectRepository.findAll();
        } else {
            // For pm, site_engineer, etc. filter by assigned projects directly
            return projectRepository.findAssignedProjectsByUserId(userId);
        }
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project projectDetails, Long userId, String role) {
        Project project = getProjectById(id);
        
        if (!"admin".equals(role)) {
            // Must be assigned to this project
            boolean isAssigned = projectAssignmentRepository.findByUserId(userId)
                    .stream()
                    .anyMatch(assignment -> assignment.getProject().getId().equals(id));
            if (!isAssigned) {
                throw new SecurityException("You are not authorized to edit this project.");
            }
        }

        project.setName(projectDetails.getName());
        project.setAddress(projectDetails.getAddress());
        project.setStartDate(projectDetails.getStartDate());
        project.setEndDate(projectDetails.getEndDate());
        project.setStatus(projectDetails.getStatus());
        
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }
}
