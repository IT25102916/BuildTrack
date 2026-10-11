package com.constructiq;

import com.constructiq.model.*;
import com.constructiq.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private DailyLogRepository dailyLogRepository;
    @Autowired private PunchItemRepository punchItemRepository;
    @Autowired private IncidentRepository incidentRepository;
    @Autowired private RfiRepository rfiRepository;
    @Autowired private SubmittalRepository submittalRepository;

    @Override
    public void run(String... args) throws Exception {
        // List of unwanted legacy/duplicate account emails to remove
        List<String> unwantedEmails = List.of(
            "admin_officer@constructiq.com",
            "finance_exec@constructiq.com",
            "inventory_sup@constructiq.com",
            "procurement_off@constructiq.com",
            "supervisor@constructiq.com",
            "jdoe@example.com",
            "client@example.com"
        );

        for (String email : unwantedEmails) {
            userRepository.findByEmail(email).ifPresent(user -> {
                try {
                    userRepository.delete(user);
                } catch (Exception ignored) {
                    // Ignore if foreign keys prevent deletion
                }
            });
        }

        // Ensure 8 standard user accounts exist with password 'demo'
        seedUser("Alexander Vance", "admin@constructiq.com", "admin", "AV", "+1 (555) 010-1001");
        User pm = seedUser("Marcus Brody", "pm@constructiq.com", "pm", "MB", "+1 (555) 010-1002");
        User siteEng = seedUser("Elena Rostova", "site_eng@constructiq.com", "site_engineer", "ER", "+1 (555) 010-1003");
        seedUser("Sarah Jenkins", "finance@constructiq.com", "finance", "SJ", "+1 (555) 010-1004");
        seedUser("David Chen", "procurement@constructiq.com", "procurement", "DC", "+1 (555) 010-1005");
        seedUser("Carlos Mendez", "inventory@constructiq.com", "inventory_manager", "CM", "+1 (555) 010-1006");
        seedUser("Liam O'Connor", "subcontractor@constructiq.com", "subcontractor", "LO", "+1 (555) 010-1007");
        seedUser("Victoria Sterling", "client@constructiq.com", "client", "VS", "+1 (555) 010-1008");

        // Ensure at least one project exists
        Project project;
        List<Project> existingProjects = projectRepository.findAll();
        if (existingProjects.isEmpty()) {
            project = new Project();
            project.setName("Skyline Heights Commercial Center");
            project.setAddress("742 Evergreen Terrace, Financial District");
            project.setStartDate(LocalDate.now().minusMonths(2));
            project.setEndDate(LocalDate.now().plusMonths(10));
            project.setStatus("In Progress");
            project.setType("Commercial");
            project.setBudget(new java.math.BigDecimal("14500000.00"));
            project = projectRepository.save(project);
        } else {
            project = existingProjects.get(0);
        }
        Long pId = project.getId();

        // 1. Seed Tasks if empty
        if (taskRepository.count() == 0) {
            Task t1 = new Task();
            t1.setProjectId(pId);
            t1.setName("Structural Steel Erection & Decking");
            t1.setStartDate(LocalDate.now().minusWeeks(2));
            t1.setEndDate(LocalDate.now().plusWeeks(3));
            t1.setAssignedUserId(siteEng.getId());
            t1.setAssignedName(siteEng.getName());
            t1.setPercentComplete(65);
            t1.setStatus("in_progress");
            t1.setMilestone(false);
            t1.setCritical(true);
            taskRepository.save(t1);

            Task t2 = new Task();
            t2.setProjectId(pId);
            t2.setName("Foundation Pours & Core Inspection");
            t2.setStartDate(LocalDate.now().minusMonths(2));
            t2.setEndDate(LocalDate.now().minusWeeks(2));
            t2.setAssignedUserId(pm.getId());
            t2.setAssignedName(pm.getName());
            t2.setPercentComplete(100);
            t2.setStatus("completed");
            t2.setMilestone(true);
            t2.setCritical(true);
            taskRepository.save(t2);

            Task t3 = new Task();
            t3.setProjectId(pId);
            t3.setName("HVAC Ductwork & Mechanical Rough-in");
            t3.setStartDate(LocalDate.now().plusDays(5));
            t3.setEndDate(LocalDate.now().plusWeeks(6));
            t3.setPercentComplete(0);
            t3.setStatus("pending");
            t3.setMilestone(false);
            t3.setCritical(false);
            taskRepository.save(t3);
        }

        // 2. Seed Daily Logs if empty
        if (dailyLogRepository.count() == 0) {
            DailyLog l1 = new DailyLog();
            l1.setProjectId(pId);
            l1.setLogDate(LocalDate.now().minusDays(1));
            l1.setWeather("Sunny");
            l1.setTemperature("74°F / 23°C");
            l1.setManpowerCount(42);
            l1.setWorkPerformed("Completed concrete pour on Level 3 floor slab (85 cubic yards). Erected structural column splices on gridlines C & D.");
            l1.setDelays("None. Site conditions optimal.");
            l1.setSigned(true);
            l1.setSignedByName("Marcus Brody (PM)");
            dailyLogRepository.save(l1);

            DailyLog l2 = new DailyLog();
            l2.setProjectId(pId);
            l2.setLogDate(LocalDate.now());
            l2.setWeather("Cloudy");
            l2.setTemperature("68°F / 20°C");
            l2.setManpowerCount(36);
            l2.setWorkPerformed("Plumbing subcontractor running riser lines through shafts. Electricians pulling conduit on 2nd floor.");
            l2.setDelays("Minor: 45 minute delay on rebar delivery due to highway traffic.");
            l2.setSigned(false);
            dailyLogRepository.save(l2);
        }

        // 3. Seed Punch Items if empty
        if (punchItemRepository.count() == 0) {
            PunchItem p1 = new PunchItem();
            p1.setProjectId(pId);
            p1.setLocation("Level 2, Room 204, East Wall");
            p1.setDescription("Drywall joint compound tape bubble near conduit opening; requires skim coating and repaint.");
            p1.setResponsibleParty("Prime Drywall Contractors");
            p1.setDueDate(LocalDate.now().plusDays(4));
            p1.setStatus("open");
            punchItemRepository.save(p1);

            PunchItem p2 = new PunchItem();
            p2.setProjectId(pId);
            p2.setLocation("Ground Floor Lobby, South Entry Door");
            p2.setDescription("Commercial double glass door latch misalignment causing friction against bottom threshold.");
            p2.setResponsibleParty("Apex Glazing & Metalworks");
            p2.setDueDate(LocalDate.now().plusDays(2));
            p2.setStatus("ready_review");
            punchItemRepository.save(p2);

            PunchItem p3 = new PunchItem();
            p3.setProjectId(pId);
            p3.setLocation("Basement Parking P-1");
            p3.setDescription("Fire sprinkler pipe bracket support anchors loose at column 14.");
            p3.setResponsibleParty("City Fire Protection");
            p3.setDueDate(LocalDate.now().minusDays(3));
            p3.setStatus("closed");
            p3.setClosedDate(LocalDate.now().minusDays(1));
            punchItemRepository.save(p3);
        }

        // 4. Seed Safety Incidents if empty
        if (incidentRepository.count() == 0) {
            Incident inc1 = new Incident();
            inc1.setProjectId(pId);
            inc1.setIncidentDate(LocalDate.now().minusDays(4));
            inc1.setSeverity("low");
            inc1.setDescription("Near-miss hazard: Unsecured scaffold toe-board on level 2 dislodged during breeze into barricaded zone. No personnel injured.");
            inc1.setActionTaken("Scaffold perimeter netting fully secured; daily pre-shift inspection checklist enacted.");
            inc1.setStatus("closed");
            incidentRepository.save(inc1);

            Incident inc2 = new Incident();
            inc2.setProjectId(pId);
            inc2.setIncidentDate(LocalDate.now());
            inc2.setSeverity("medium");
            inc2.setDescription("Electrician apprentice sustained minor hand cut while stripping 500kcmil cable insulation. First-aid treated on site.");
            inc2.setActionTaken("Safety officer inspected PPE; mandatory ANSI Cut-Level A4 gloves restocked and distributed.");
            inc2.setStatus("open");
            incidentRepository.save(inc2);
        }

        // 5. Seed RFIs & Submittals if empty
        if (rfiRepository.count() == 0) {
            Rfi rfi1 = new Rfi();
            rfi1.setProjectId(pId);
            rfi1.setRfiNumber("RFI-001");
            rfi1.setSubject("Discrepancy between Architectural A-201 and Structural S-105 MEP sleeve penetrations");
            rfi1.setBallInCourt("Thornton Structural Engineers");
            rfi1.setAssignedTo("Robert Miller, PE");
            rfi1.setDueDate(LocalDate.now().plusDays(3));
            rfi1.setStatus("open");
            rfiRepository.save(rfi1);

            Rfi rfi2 = new Rfi();
            rfi2.setProjectId(pId);
            rfi2.setRfiNumber("RFI-002");
            rfi2.setSubject("Clarification on specified vapor barrier primer compatibility with poured green concrete");
            rfi2.setBallInCourt("Marcus Brody (PM)");
            rfi2.setAssignedTo("Marcus Brody");
            rfi2.setDueDate(LocalDate.now().minusDays(2));
            rfi2.setStatus("responded");
            rfi2.setResponse("Architect confirmed: Grace Perm-A-Barrier WB Primer is approved for green concrete older than 7 days per addendum #3.");
            rfiRepository.save(rfi2);
        }

        if (submittalRepository.count() == 0) {
            Submittal sub1 = new Submittal();
            sub1.setProjectId(pId);
            sub1.setSubmittalNumber("SUB-001");
            sub1.setSpecSection("03 30 00");
            sub1.setDescription("Cast-in-Place Concrete Mix Design (4,500 PSI High Early Strength with Micro-Silica)");
            sub1.setSubmittedByName("Elena Rostova");
            sub1.setReviewedBy("Marcus Brody");
            sub1.setStatus("approved");
            submittalRepository.save(sub1);

            Submittal sub2 = new Submittal();
            sub2.setProjectId(pId);
            sub2.setSubmittalNumber("SUB-002");
            sub2.setSpecSection("23 00 00");
            sub2.setDescription("Rooftop HVAC Packaged Air Handling Units (AHU-1 & AHU-2) Submittal & Acoustical Data");
            sub2.setSubmittedByName("Liam O'Connor");
            sub2.setReviewedBy("Pending Review");
            sub2.setStatus("pending");
            submittalRepository.save(sub2);
        }
    }

    private User seedUser(String name, String email, String role, String avatar, String phone) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setPasswordHash("demo");
        user.setAvatarInitials(avatar);
        user.setPhone(phone);
        user.setActive(true);
        return userRepository.save(user);
    }
}
