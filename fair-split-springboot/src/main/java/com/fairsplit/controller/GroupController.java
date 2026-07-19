package com.fairsplit.controller;

import com.fairsplit.dto.CreateGroupRequest;
import com.fairsplit.model.Group;
import com.fairsplit.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<Group> createGroup(@Valid @RequestBody CreateGroupRequest request) {
        Group group = groupService.createGroup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(group);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroup(@PathVariable String id) {
        return ResponseEntity.ok(groupService.getGroup(id));
    }
}
