package com.fairsplit.model;

import java.time.Instant;
import java.util.List;

public class Expense {
    private String id;
    private String description;
    private String paidBy;      // member id
    private double amount;
    private List<String> splitAmong; // member ids
    private Instant createdAt;

    public Expense() {}

    public Expense(String id, String description, String paidBy, double amount, List<String> splitAmong) {
        this.id = id;
        this.description = description;
        this.paidBy = paidBy;
        this.amount = amount;
        this.splitAmong = splitAmong;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPaidBy() { return paidBy; }
    public void setPaidBy(String paidBy) { this.paidBy = paidBy; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public List<String> getSplitAmong() { return splitAmong; }
    public void setSplitAmong(List<String> splitAmong) { this.splitAmong = splitAmong; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
