package com.fairsplit.service;

import com.fairsplit.dto.AddExpenseRequest;
import com.fairsplit.dto.CreateGroupRequest;
import com.fairsplit.dto.SettlementResponse;
import com.fairsplit.dto.TransactionDto;
import com.fairsplit.exception.ExpenseNotFoundException;
import com.fairsplit.exception.GroupNotFoundException;
import com.fairsplit.exception.InvalidExpenseException;
import com.fairsplit.model.Expense;
import com.fairsplit.model.Group;
import com.fairsplit.model.Member;
import com.fairsplit.store.GroupStore;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private final GroupStore store;
    private final SettlementService settlementService;

    public GroupService(GroupStore store, SettlementService settlementService) {
        this.store = store;
        this.settlementService = settlementService;
    }

    public Group createGroup(CreateGroupRequest request) {
        List<Member> members = request.getMembers().stream()
                .map(name -> new Member(UUID.randomUUID().toString(), name.trim()))
                .collect(Collectors.toList());

        Group group = new Group(UUID.randomUUID().toString(), request.getName().trim(), members);
        return store.save(group);
    }

    public Group getGroup(String groupId) {
        return store.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException(groupId));
    }

    public Expense addExpense(String groupId, AddExpenseRequest request) {
        Group group = getGroup(groupId);

        Set<String> memberIds = group.getMembers().stream()
                .map(Member::getId)
                .collect(Collectors.toSet());

        if (!memberIds.contains(request.getPaidBy())) {
            throw new InvalidExpenseException("paidBy must be a valid member id in this group");
        }

        List<String> invalidSplitMembers = request.getSplitAmong().stream()
                .filter(id -> !memberIds.contains(id))
                .collect(Collectors.toList());

        if (!invalidSplitMembers.isEmpty()) {
            throw new InvalidExpenseException(
                    "splitAmong contains member ids not in this group: " + invalidSplitMembers);
        }

        Expense expense = new Expense(
                UUID.randomUUID().toString(),
                (request.getDescription() == null || request.getDescription().isBlank())
                        ? "Expense" : request.getDescription().trim(),
                request.getPaidBy(),
                request.getAmount(),
                request.getSplitAmong()
        );

        group.getExpenses().add(expense);
        return expense;
    }

    public Expense updateExpense(String groupId, String expenseId, AddExpenseRequest request) {
        Group group = getGroup(groupId);

        Expense existing = group.getExpenses().stream()
                .filter(e -> e.getId().equals(expenseId))
                .findFirst()
                .orElseThrow(() -> new ExpenseNotFoundException(expenseId));

        Set<String> memberIds = group.getMembers().stream()
                .map(Member::getId)
                .collect(Collectors.toSet());

        if (!memberIds.contains(request.getPaidBy())) {
            throw new InvalidExpenseException("paidBy must be a valid member id in this group");
        }
        List<String> invalidSplitMembers = request.getSplitAmong().stream()
                .filter(id -> !memberIds.contains(id))
                .collect(Collectors.toList());
        if (!invalidSplitMembers.isEmpty()) {
            throw new InvalidExpenseException(
                    "splitAmong contains member ids not in this group: " + invalidSplitMembers);
        }

        existing.setDescription(
                (request.getDescription() == null || request.getDescription().isBlank())
                        ? "Expense" : request.getDescription().trim());
        existing.setPaidBy(request.getPaidBy());
        existing.setAmount(request.getAmount());
        existing.setSplitAmong(request.getSplitAmong());

        return existing;
    }

    public void deleteExpense(String groupId, String expenseId) {
        Group group = getGroup(groupId);
        boolean removed = group.getExpenses().removeIf(e -> e.getId().equals(expenseId));
        if (!removed) {
            throw new ExpenseNotFoundException(expenseId);
        }
    }

    public SettlementResponse settle(String groupId) {
        Group group = getGroup(groupId);

        Map<String, String> idToName = group.getMembers().stream()
                .collect(Collectors.toMap(Member::getId, Member::getName));

        if (group.getExpenses().isEmpty()) {
            Map<String, Double> zeroBalances = group.getMembers().stream()
                    .collect(Collectors.toMap(Member::getName, m -> 0.0, (a, b) -> a, LinkedHashMap::new));
            SettlementResponse response = new SettlementResponse(groupId, zeroBalances, List.of());
            response.setMessage("No expenses yet — nothing to settle.");
            return response;
        }

        Map<String, Double> balancesById = settlementService.computeBalances(group.getMembers(), group.getExpenses());
        List<SettlementService.Transaction> transactions = settlementService.simplifyDebts(balancesById);

        Map<String, Double> balancesByName = new LinkedHashMap<>();
        balancesById.forEach((id, amt) -> balancesByName.put(idToName.get(id), amt));

        List<TransactionDto> namedTransactions = transactions.stream()
                .map(t -> new TransactionDto(t.from, idToName.get(t.from), t.to, idToName.get(t.to), t.amount))
                .collect(Collectors.toList());

        return new SettlementResponse(groupId, balancesByName, namedTransactions);
    }
}
