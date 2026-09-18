package com.constructiq.service;

import com.constructiq.exception.ResourceNotFoundException;
import com.constructiq.model.Project;
import com.constructiq.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@SuppressWarnings("null")
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);
        
        project.setName(projectDetails.getName());
        project.setAddress(projectDetails.getAddress());
        project.setStartDate(projectDetails.getStartDate());
        project.setEndDate(projectDetails.getEndDate());
        project.setStatus(projectDetails.getStatus());
        if (projectDetails.getType() != null) {
            project.setType(projectDetails.getType());
        }
        if (projectDetails.getBudget() != null) {
            project.setBudget(projectDetails.getBudget());
        }
        if (projectDetails.getClientId() != null) {
            project.setClientId(projectDetails.getClientId());
        }
        if (projectDetails.getClientName() != null) {
            project.setClientName(projectDetails.getClientName());
        }
        
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }
}
