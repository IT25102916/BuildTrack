package com.constructiq.controller;

import com.constructiq.model.Document;
import com.constructiq.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    @GetMapping("/project/{projectId}")
    public List<Document> getProjectDocuments(@PathVariable Long projectId) {
        return documentRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    @PostMapping
    @com.constructiq.security.RequireRole({"pm", "site_engineer", "admin", "client"})
    public Document uploadDocument(@RequestBody Document document) {
        return documentRepository.save(document);
    }

    @DeleteMapping("/{id}")
    @com.constructiq.security.RequireRole({"pm", "admin"})
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        if (!documentRepository.existsById(id)) return ResponseEntity.notFound().build();
        documentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
