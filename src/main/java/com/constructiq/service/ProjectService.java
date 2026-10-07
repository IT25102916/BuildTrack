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
    private final com.constructiq.repository.TaskRepository taskRepository;
    private final com.constructiq.repository.PunchItemRepository punchItemRepository;
    private final com.constructiq.repository.DailyLogRepository dailyLogRepository;
    private final com.constructiq.repository.RfiRepository rfiRepository;
    private final com.constructiq.repository.SubmittalRepository submittalRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository,
                          ProjectAssignmentRepository projectAssignmentRepository,
                          com.constructiq.repository.TaskRepository taskRepository,
                          com.constructiq.repository.PunchItemRepository punchItemRepository,
                          com.constructiq.repository.DailyLogRepository dailyLogRepository,
                          com.constructiq.repository.RfiRepository rfiRepository,
                          com.constructiq.repository.SubmittalRepository submittalRepository) {
        this.projectRepository = projectRepository;
        this.projectAssignmentRepository = projectAssignmentRepository;
        this.taskRepository = taskRepository;
        this.punchItemRepository = punchItemRepository;
        this.dailyLogRepository = dailyLogRepository;
        this.rfiRepository = rfiRepository;
        this.submittalRepository = submittalRepository;
    }

    private void validateProjectDates(Project project) {
        if (project.getEndDate() != null && project.getStartDate() != null && project.getEndDate().isBefore(project.getStartDate())) {
            throw new IllegalArgumentException("Project end date cannot be earlier than start date.");
        }
    }

    public List<Long> getAccessibleProjectIds(Long userId, String role) {
        if (role == null) return List.of();
        String r = role.toLowerCase();
        if ("admin".equals(r) || "procurement".equals(r) || "inventory_manager".equals(r) || r.contains("finance")) {
            return projectRepository.findAll().stream().map(Project::getId).collect(Collectors.toList());
        }
        return projectAssignmentRepository.findByUserId(userId)
                .stream()
                .map(a -> a.getProject().getId())
                .collect(Collectors.toList());
    }

    public List<Project> getAllProjects(Long userId, String role) {
        if (role == null) return List.of();
        String r = role.toLowerCase();
        if ("admin".equals(r) || "procurement".equals(r) || "inventory_manager".equals(r) || r.contains("finance")) {
            return projectRepository.findAll();
        } else {
            return projectRepository.findAssignedProjectsByUserId(userId);
        }
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project createProject(Project project) {
        validateProjectDates(project);
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project projectDetails, Long userId, String role) {
        Project project = getProjectById(id);
        
        if (!"admin".equals(role)) {
            boolean isAssigned = projectAssignmentRepository.findByUserId(userId)
                    .stream()
                    .anyMatch(assignment -> assignment.getProject().getId().equals(id));
            if (!isAssigned) {
                throw new SecurityException("You are not authorized to edit this project.");
            }
        }

        validateProjectDates(projectDetails);

        project.setName(projectDetails.getName());
        project.setAddress(projectDetails.getAddress());
        project.setStartDate(projectDetails.getStartDate());
        project.setEndDate(projectDetails.getEndDate());
        project.setStatus(projectDetails.getStatus());
        if (projectDetails.getType() != null) project.setType(projectDetails.getType());
        if (projectDetails.getBudget() != null) project.setBudget(projectDetails.getBudget());
        
        return projectRepository.save(project);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        taskRepository.deleteByProjectId(id);
        punchItemRepository.deleteByProjectId(id);
        dailyLogRepository.deleteByProjectId(id);
        rfiRepository.deleteByProjectId(id);
        submittalRepository.deleteByProjectId(id);
        projectAssignmentRepository.deleteByProjectId(id);
        projectRepository.delete(project);
    }
}
