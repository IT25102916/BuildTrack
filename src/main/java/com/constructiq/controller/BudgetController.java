package com.constructiq.controller;

import com.constructiq.model.BudgetLine;
import com.constructiq.model.ChangeOrder;
import com.constructiq.repository.BudgetLineRepository;
import com.constructiq.repository.ChangeOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
@SuppressWarnings("null")
public class BudgetController {

    @Autowired private BudgetLineRepository budgetLineRepository;
    @Autowired private ChangeOrderRepository changeOrderRepository;

    // ── Budget Lines ──────────────────────────────────────

    @GetMapping("/lines/project/{projectId}")
    public List<BudgetLine> getLines(@PathVariable Long projectId) {
        return budgetLineRepository.findByProjectId(projectId);
    }

    @PostMapping("/lines")
    public BudgetLine createLine(@RequestBody BudgetLine line) {
        return budgetLineRepository.save(line);
    }

    @PutMapping("/lines/{id}")
    public ResponseEntity<BudgetLine> updateLine(@PathVariable Long id, @RequestBody BudgetLine updates) {
        return budgetLineRepository.findById(id).map(l -> {
            l.setCostCode(updates.getCostCode());
            l.setDescription(updates.getDescription());
            l.setBudgetedAmount(updates.getBudgetedAmount());
            l.setCommittedAmount(updates.getCommittedAmount());
            l.setActualAmount(updates.getActualAmount());
            return ResponseEntity.ok(budgetLineRepository.save(l));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/lines/{id}")
    public ResponseEntity<Void> deleteLine(@PathVariable Long id) {
        if (!budgetLineRepository.existsById(id)) return ResponseEntity.notFound().build();
        budgetLineRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Change Orders ─────────────────────────────────────

    @GetMapping("/change-orders/project/{projectId}")
    public List<ChangeOrder> getChangeOrders(@PathVariable Long projectId) {
        return changeOrderRepository.findByProjectId(projectId);
    }

    @PostMapping("/change-orders")
    public ChangeOrder createChangeOrder(@RequestBody ChangeOrder co) {
        return changeOrderRepository.save(co);
    }

    @PutMapping("/change-orders/{id}")
    public ResponseEntity<ChangeOrder> updateChangeOrder(@PathVariable Long id, @RequestBody ChangeOrder updates) {
        return changeOrderRepository.findById(id).map(co -> {
            co.setStatus(updates.getStatus());
            co.setDescription(updates.getDescription());
            co.setCostImpact(updates.getCostImpact());
            co.setScheduleImpactDays(updates.getScheduleImpactDays());
            return ResponseEntity.ok(changeOrderRepository.save(co));
        }).orElse(ResponseEntity.notFound().build());
    }
}
