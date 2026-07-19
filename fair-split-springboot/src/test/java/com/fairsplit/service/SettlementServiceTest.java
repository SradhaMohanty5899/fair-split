package com.fairsplit.service;

import com.fairsplit.model.Expense;
import com.fairsplit.model.Member;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class SettlementServiceTest {

    private final SettlementService service = new SettlementService();

    @Test
    void computeBalances_simpleThreeWaySplit() {
        List<Member> members = List.of(new Member("A", "A"), new Member("B", "B"), new Member("C", "C"));
        List<Expense> expenses = List.of(new Expense("e1", "test", "A", 300, List.of("A", "B", "C")));

        Map<String, Double> balances = service.computeBalances(members, expenses);

        assertEquals(200.0, balances.get("A"), 0.01); // paid 300, owed 100 -> +200
        assertEquals(-100.0, balances.get("B"), 0.01);
        assertEquals(-100.0, balances.get("C"), 0.01);
    }

    @Test
    void simplifyDebts_minimizesTransactions() {
        Map<String, Double> balances = Map.of("A", 200.0, "B", -100.0, "C", -100.0);

        List<SettlementService.Transaction> txns = service.simplifyDebts(balances);

        assertEquals(2, txns.size());
        txns.forEach(t -> assertEquals("A", t.to));
    }

    @Test
    void simplifyDebts_netZeroCollapsesToNoTransactions() {
        Map<String, Double> balances = Map.of("A", 0.0, "B", 0.0, "C", 0.0);

        List<SettlementService.Transaction> txns = service.simplifyDebts(balances);

        assertTrue(txns.isEmpty());
    }

    @Test
    void fullFlow_balancesNetToZeroAndTransactionsArePositive() {
        List<Member> members = List.of(
                new Member("me", "me"), new Member("f1", "f1"),
                new Member("f2", "f2"), new Member("f3", "f3"));
        List<Expense> expenses = List.of(
                new Expense("e1", "hotel", "me", 2000, List.of("me", "f1", "f2", "f3")),
                new Expense("e2", "dinner", "f1", 1200, List.of("me", "f1", "f2", "f3")),
                new Expense("e3", "cab", "f2", 800, List.of("me", "f1", "f2"))
        );

        Map<String, Double> balances = service.computeBalances(members, expenses);
        double total = balances.values().stream().mapToDouble(Double::doubleValue).sum();
        assertEquals(0.0, total, 0.01);

        List<SettlementService.Transaction> txns = service.simplifyDebts(balances);
        txns.forEach(t -> assertTrue(t.amount > 0));
    }

    @Test
    void singleMemberGroup_noTransactions() {
        List<Member> members = List.of(new Member("solo", "solo"));
        List<Expense> expenses = List.of(new Expense("e1", "test", "solo", 500, List.of("solo")));

        Map<String, Double> balances = service.computeBalances(members, expenses);
        List<SettlementService.Transaction> txns = service.simplifyDebts(balances);

        assertTrue(txns.isEmpty());
    }
}
