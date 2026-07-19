package com.fairsplit.service;

import com.fairsplit.model.Expense;
import com.fairsplit.model.Member;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Two-step debt-simplification algorithm:
 *   1. computeBalances -> net position of every member (who's "up", who's "down")
 *   2. simplifyDebts   -> greedy matching of biggest creditor <-> biggest debtor,
 *                         repeated until everyone is settled. Minimizes the number
 *                         of transactions needed.
 *
 * Deliberately framework-free (no Spring annotations touching the math) so it can
 * be unit tested in complete isolation, and so your API test suite has a pure
 * logic layer to target in addition to HTTP-level tests.
 */
@Service
public class SettlementService {

    private static final double EPSILON = 0.01; // ignore anything under 1 paisa (float safety)

    /**
     * @return map of memberId -> net amount.
     *         positive = group owes this person; negative = this person owes the group
     */
    public Map<String, Double> computeBalances(List<Member> members, List<Expense> expenses) {
        Map<String, Double> balances = new LinkedHashMap<>();
        for (Member m : members) {
            balances.put(m.getId(), 0.0);
        }

        for (Expense exp : expenses) {
            int splitCount = exp.getSplitAmong().size();
            double share = exp.getAmount() / splitCount;

            balances.merge(exp.getPaidBy(), exp.getAmount(), Double::sum);

            for (String memberId : exp.getSplitAmong()) {
                balances.merge(memberId, -share, Double::sum);
            }
        }

        // round to 2 decimals to avoid float drift
        balances.replaceAll((id, amt) -> Math.round(amt * 100.0) / 100.0);
        return balances;
    }

    public static class Transaction {
        public final String from;
        public final String to;
        public final double amount;

        public Transaction(String from, String to, double amount) {
            this.from = from;
            this.to = to;
            this.amount = amount;
        }
    }

    /**
     * Greedy debt simplification: repeatedly settle the biggest debtor against
     * the biggest creditor until everyone nets to zero.
     */
    public List<Transaction> simplifyDebts(Map<String, Double> balances) {
        // mutable working lists of [id, amount]
        List<Object[]> creditors = new ArrayList<>();
        List<Object[]> debtors = new ArrayList<>();

        for (Map.Entry<String, Double> e : balances.entrySet()) {
            double amt = e.getValue();
            if (amt > EPSILON) creditors.add(new Object[]{e.getKey(), amt});
            else if (amt < -EPSILON) debtors.add(new Object[]{e.getKey(), amt});
        }

        List<Transaction> transactions = new ArrayList<>();

        while (!creditors.isEmpty() && !debtors.isEmpty()) {
            creditors.sort((a, b) -> Double.compare((double) b[1], (double) a[1]));
            debtors.sort((a, b) -> Double.compare((double) a[1], (double) b[1]));

            Object[] creditor = creditors.get(0);
            Object[] debtor = debtors.get(0);

            double creditorAmt = (double) creditor[1];
            double debtorAmt = (double) debtor[1];

            double settleAmount = Math.min(creditorAmt, -debtorAmt);
            double rounded = Math.round(settleAmount * 100.0) / 100.0;

            transactions.add(new Transaction((String) debtor[0], (String) creditor[0], rounded));

            creditor[1] = creditorAmt - settleAmount;
            debtor[1] = debtorAmt + settleAmount;

            if (Math.abs((double) creditor[1]) < EPSILON) creditors.remove(0);
            if (Math.abs((double) debtor[1]) < EPSILON) debtors.remove(0);
        }

        return transactions;
    }
}
