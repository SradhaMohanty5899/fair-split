package com.fairsplit.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Group {
    private String id;
    private String name;
    private List<Member> members = new ArrayList<>();
    private List<Expense> expenses = new ArrayList<>();
    private Instant createdAt;

    public Group() {}

    public Group(String id, String name, List<Member> members) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<Member> getMembers() { return members; }
    public void setMembers(List<Member> members) { this.members = members; }

    public List<Expense> getExpenses() { return expenses; }
    public void setExpenses(List<Expense> expenses) { this.expenses = expenses; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
