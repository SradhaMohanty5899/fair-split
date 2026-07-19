package com.fairsplit.dto;

import java.util.List;
import java.util.Map;

public class SettlementResponse {
    private String groupId;
    private Map<String, Double> balances; // keyed by member name
    private int transactionCount;
    private List<TransactionDto> transactions;
    private String message; // optional, e.g. "no expenses yet"

    public SettlementResponse() {}

    public SettlementResponse(String groupId, Map<String, Double> balances,
                               List<TransactionDto> transactions) {
        this.groupId = groupId;
        this.balances = balances;
        this.transactions = transactions;
        this.transactionCount = transactions.size();
    }

    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }

    public Map<String, Double> getBalances() { return balances; }
    public void setBalances(Map<String, Double> balances) { this.balances = balances; }

    public int getTransactionCount() { return transactionCount; }
    public void setTransactionCount(int transactionCount) { this.transactionCount = transactionCount; }

    public List<TransactionDto> getTransactions() { return transactions; }
    public void setTransactions(List<TransactionDto> transactions) { this.transactions = transactions; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
