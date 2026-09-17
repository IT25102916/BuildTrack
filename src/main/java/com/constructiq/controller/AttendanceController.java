package com.constructiq.controller;

import com.constructiq.model.Attendance;
import com.constructiq.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@SuppressWarnings("null")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    @Autowired
    public AttendanceController(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(@PathVariable String date) {
        return ResponseEntity.ok(attendanceRepository.findByWorkDate(LocalDate.parse(date)));
    }

    @PostMapping("/clock-in")
    public ResponseEntity<Attendance> clockIn(@RequestBody Attendance attendance) {
        attendance.setWorkDate(LocalDate.now());
        attendance.setClockIn(LocalDateTime.now());
        attendance.setStatus("Present");
        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }

    @PutMapping("/{id}/clock-out")
    public ResponseEntity<Attendance> clockOut(@PathVariable Long id) {
        return attendanceRepository.findById(id).map(a -> {
            a.setClockOut(LocalDateTime.now());
            return ResponseEntity.ok(attendanceRepository.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }
}
