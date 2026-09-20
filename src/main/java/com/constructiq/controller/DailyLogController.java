package com.constructiq.controller;

import com.constructiq.model.DailyLog;
import com.constructiq.repository.DailyLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.constructiq.security.RequireRole;

@RestController
@RequestMapping("/api/daily-logs")
@SuppressWarnings("null")
public class DailyLogController {

    @Autowired private DailyLogRepository dailyLogRepository;

    @GetMapping
    public List<DailyLog> getAllLogs() {
        return dailyLogRepository.findAll();
    }

    @GetMapping("/project/{projectId}")
    public List<DailyLog> getByProject(@PathVariable Long projectId) {
        return dailyLogRepository.findByProjectIdOrderByLogDateDesc(projectId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DailyLog> getById(@PathVariable Long id) {
        return dailyLogRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @RequireRole({"site_engineer", "pm", "admin"})
    public DailyLog create(@RequestBody DailyLog log) { return dailyLogRepository.save(log); }

    @PutMapping("/{id}")
    @RequireRole({"site_engineer", "pm", "admin"})
    public ResponseEntity<DailyLog> update(@PathVariable Long id, @RequestBody DailyLog updates) {
        return dailyLogRepository.findById(id).map(l -> {
            if (updates.getWeather() != null) l.setWeather(updates.getWeather());
            if (updates.getTemperature() != null) l.setTemperature(updates.getTemperature());
            if (updates.getManpowerCount() > 0) l.setManpowerCount(updates.getManpowerCount());
            if (updates.getWorkPerformed() != null) l.setWorkPerformed(updates.getWorkPerformed());
            if (updates.getDelays() != null) l.setDelays(updates.getDelays());
            if (updates.isIsSigned()) {
                l.setSigned(true);
            }
            if (updates.getSignedByName() != null) l.setSignedByName(updates.getSignedByName());
            if (updates.getPhotoCount() > 0) l.setPhotoCount(updates.getPhotoCount());
            return ResponseEntity.ok(dailyLogRepository.save(l));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @RequireRole({"site_engineer", "pm", "admin"})
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!dailyLogRepository.existsById(id)) return ResponseEntity.notFound().build();
        dailyLogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
