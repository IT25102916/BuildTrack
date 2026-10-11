package com.constructiq;

import com.constructiq.model.Project;
import com.constructiq.model.Issue;
import com.constructiq.model.MaterialRequest;
import com.constructiq.repository.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
public class SiteEngineerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private com.constructiq.repository.UserRepository userRepository;

    @Test
    public void testSiteEngineerWorkflow() throws Exception {
        com.constructiq.model.User user = userRepository.findByEmail("admin@constructiq.com").orElseThrow();

        // 1. Create a project to work with
        Project project = new Project();
        project.setName("Test Site Engineering");
        project.setAddress("123 Test Street");
        project.setStatus("ongoing");
        project.setStartDate(LocalDate.now());
        project.setEndDate(LocalDate.now().plusMonths(6));
        project.setBudget(BigDecimal.valueOf(100000));
        project = projectRepository.save(project);
        
        // 2. Report a site issue
        Issue issue = new Issue();
        issue.setProjectId(project.getId());
        issue.setDescription("Heavy rain blocking site access");
        issue.setReportedByUserId(user.getId());
        issue.setStatus("OPEN");
        
        mockMvc.perform(post("/api/issues")
                .sessionAttr("userId", user.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(issue)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.description").value("Heavy rain blocking site access"));
                
        // 3. Request Materials
        MaterialRequest mr = new MaterialRequest();
        mr.setProjectId(project.getId());
        mr.setMaterialDescription("Cement Bags");
        mr.setRequestedByUserId(user.getId());
        mr.setRequestedByName("Site Engineer");
        
        mockMvc.perform(post("/api/procurement/material-requests")
                .sessionAttr("userId", user.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mr)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.materialDescription").value("Cement Bags"));
    }
}
