package com.constructiq;

import com.constructiq.model.Project;
import com.constructiq.model.Transaction;
import com.constructiq.model.User;
import com.constructiq.repository.ProjectRepository;
import com.constructiq.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
public class FinanceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testPayrollAndTransactionWorkflow() throws Exception {
        // Find or create admin user for session authentication
        User user = userRepository.findByEmail("admin@constructiq.com").orElseThrow();

        // 1. Create a project
        Project project = new Project();
        project.setName("Payroll Test Project");
        project.setAddress("456 Finance Blvd");
        project.setStatus("ongoing");
        project.setStartDate(LocalDate.now());
        project.setEndDate(LocalDate.now().plusMonths(6));
        project.setBudget(BigDecimal.valueOf(500000));
        project = projectRepository.save(project);

        // 2. Add Payroll Payment (simulating UI request)
        String payrollJson = "{"
                + "\"projectId\":" + project.getId() + ","
                + "\"transactionDate\":\"2026-09-20\","
                + "\"type\":\"PAYROLL\","
                + "\"category\":\"Payroll\","
                + "\"amount\":12345.00,"
                + "\"description\":\"Site worker bi-weekly salary\""
                + "}";

        String response = mockMvc.perform(post("/api/finance/transactions")
                        .sessionAttr("userId", user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payrollJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.projectId").value(project.getId()))
                .andExpect(jsonPath("$.type").value("PAYROLL"))
                .andExpect(jsonPath("$.amount").value(12345.00))
                .andReturn().getResponse().getContentAsString();

        Transaction created = objectMapper.readValue(response, Transaction.class);

        // 3. Verify get payroll endpoint
        mockMvc.perform(get("/api/finance/transactions/payroll")
                        .sessionAttr("userId", user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + created.getId() + ")].projectId").value(project.getId().intValue()));

        // 4. Update transaction
        created.setDescription("Updated site worker bi-weekly salary");
        mockMvc.perform(put("/api/finance/transactions/" + created.getId())
                        .sessionAttr("userId", user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Updated site worker bi-weekly salary"));

        // 5. Delete transaction
        mockMvc.perform(delete("/api/finance/transactions/" + created.getId())
                        .sessionAttr("userId", user.getId()))
                .andExpect(status().isNoContent());
    }
}
