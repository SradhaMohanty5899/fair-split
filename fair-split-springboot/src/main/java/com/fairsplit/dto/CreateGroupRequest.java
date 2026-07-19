package com.fairsplit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class CreateGroupRequest {

    @NotBlank(message = "Group name is required")
    private String name;

    @NotEmpty(message = "At least one member is required")
    private List<String> members;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<String> getMembers() { return members; }
    public void setMembers(List<String> members) { this.members = members; }
}
