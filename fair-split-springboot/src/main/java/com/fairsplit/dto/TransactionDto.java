package com.fairsplit.dto;

public class TransactionDto {
    private String fromId;
    private String from;
    private String toId;
    private String to;
    private double amount;

    public TransactionDto() {}

    public TransactionDto(String fromId, String from, String toId, String to, double amount) {
        this.fromId = fromId;
        this.from = from;
        this.toId = toId;
        this.to = to;
        this.amount = amount;
    }

    public String getFromId() { return fromId; }
    public void setFromId(String fromId) { this.fromId = fromId; }

    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getToId() { return toId; }
    public void setToId(String toId) { this.toId = toId; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}
