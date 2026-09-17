package com.constructiq.controller;

import com.constructiq.model.Message;
import com.constructiq.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@SuppressWarnings("null")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/project/{projectId}")
    public List<Message> getProjectMessages(@PathVariable Long projectId) {
        return messageRepository.findByProjectIdOrderBySentAtAsc(projectId);
    }

    @GetMapping("/user/{userId}")
    public List<Message> getUserMessages(@PathVariable Long userId) {
        return messageRepository.findByReceiverIdOrderBySentAtDesc(userId);
    }

    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        return messageRepository.save(message);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Message> markAsRead(@PathVariable Long id) {
        return messageRepository.findById(id).map(msg -> {
            msg.setRead(true);
            return ResponseEntity.ok(messageRepository.save(msg));
        }).orElse(ResponseEntity.notFound().build());
    }
}
