package com.fairsplit.controller;

import com.fairsplit.dto.AddExpenseRequest;
import com.fairsplit.model.Expense;
import com.fairsplit.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/expenses")
public class ExpenseController {

    private final GroupService groupService;

    public ExpenseController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@PathVariable String groupId,
                                               @Valid @RequestBody AddExpenseRequest request) {
        Expense expense = groupService.addExpense(groupId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(expense);
    }

    @GetMapping
    public ResponseEntity<List<Expense>> listExpenses(@PathVariable String groupId) {
        return ResponseEntity.ok(groupService.getGroup(groupId).getExpenses());
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<Expense> updateExpense(@PathVariable String groupId,
                                                  @PathVariable String expenseId,
                                                  @Valid @RequestBody AddExpenseRequest request) {
        Expense expense = groupService.updateExpense(groupId, expenseId, request);
        return ResponseEntity.ok(expense);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String groupId,
                                               @PathVariable String expenseId) {
        groupService.deleteExpense(groupId, expenseId);
        return ResponseEntity.noContent().build();
    }
}
