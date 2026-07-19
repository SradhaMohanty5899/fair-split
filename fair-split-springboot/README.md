# Fair Split — Backend (Spring Boot)

Group expense settlement API in Java/Spring Boot. Computes the minimum number
of payments needed to settle a group's shared expenses using a greedy
debt-simplification algorithm.

## Setup

You need Java 17+ and Maven installed.

```bash
mvn spring-boot:run
```

Server starts on `http://localhost:5000`.

```bash
mvn test
```

Runs `SettlementServiceTest` — 5 unit tests covering balance computation,
greedy matching, net-zero collapse, the full worked example, and the
single-member edge case.

## Endpoints

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/groups` | `{ name, members: [string] }` | Create a group |
| GET | `/api/groups/{id}` | — | Get group details (includes expenses) |
| POST | `/api/groups/{groupId}/expenses` | `{ description, paidBy, amount, splitAmong: [memberId] }` | Add an expense |
| GET | `/api/groups/{groupId}/expenses` | — | List expenses for a group |
| PUT | `/api/groups/{groupId}/expenses/{expenseId}` | Same shape as add | Edit an existing expense |
| DELETE | `/api/groups/{groupId}/expenses/{expenseId}` | — | Delete an expense |
| GET | `/api/groups/{groupId}/settle` | — | Compute minimum settlement transactions |

## Architecture

```
controller/   -> HTTP layer (GroupController, ExpenseController, SettleController)
service/      -> GroupService (orchestration + validation), SettlementService (pure algorithm)
model/        -> Group, Member, Expense
dto/          -> request/response shapes, decoupled from internal models
store/        -> GroupStore (in-memory ConcurrentHashMap; swap for JPA repo for real persistence)
exception/    -> GroupNotFoundException, ExpenseNotFoundException, InvalidExpenseException, GlobalExceptionHandler
```

`SettlementService` has zero Spring/web dependencies — it's pure Java, which is
why it's fully unit-testable without spinning up the application context.

CORS is configured in `FairSplitApplication` to allow `http://localhost:3000`
(the Next.js frontend).

## Known limitations (intentional, for a portfolio-scope project)

- **In-memory storage** — data is lost on restart. Fine for demoing/testing;
  would swap `GroupStore` for a JPA repository + real database for production use.
- **No authentication** — anyone with a group's UUID can view/modify it. The
  UUIDs are non-guessable, which is the current mitigation, but there's no
  real access control layer.