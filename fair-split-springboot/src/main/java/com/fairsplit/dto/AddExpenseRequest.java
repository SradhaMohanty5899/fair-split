package com.fairsplit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.util.List;

public class AddExpenseRequest {

    private String description;

    @NotBlank(message = "paidBy is required")
    private String paidBy;

    @Positive(message = "Amount must be a positive number")
    private double amount;

    @NotEmpty(message = "splitAmong must be a non-empty array of member ids")
    private List<String> splitAmong;

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPaidBy() { return paidBy; }
    public void setPaidBy(String paidBy) { this.paidBy = paidBy; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public List<String> getSplitAmong() { return splitAmong; }
    public void setSplitAmong(List<String> splitAmong) { this.splitAmong = splitAmong; }
}
