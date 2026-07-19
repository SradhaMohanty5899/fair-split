package com.fairsplit.controller;

import com.fairsplit.dto.SettlementResponse;
import com.fairsplit.service.GroupService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups/{groupId}/settle")
public class SettleController {

    private final GroupService groupService;

    public SettleController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping
    public SettlementResponse settle(@PathVariable String groupId) {
        return groupService.settle(groupId);
    }
}
