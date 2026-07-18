# Fair Split 🤑

A group expense settlement app — split trip costs, and get the **minimum
number of payments** needed to settle everyone up, instead of everyone paying
everyone.

Built as a full-stack + QA portfolio project: real algorithmic logic behind
a polished UI, backed by manual and automated test suites.

## The problem it solves

Split a hotel, dinner, and cab bill unevenly across a group trip, and you
usually end up with 6-7 confusing back-and-forth payments. This app takes all
the expenses and calculates the smallest possible set of payments that
settles everyone — using a greedy debt-simplification algorithm.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Java 17, Spring Boot 3 |
| Manual testing | Excel test cases, Postman collection |
| Automation | REST Assured + TestNG (API), Selenium + Cucumber BDD (UI) |
| CI/CD | Jenkins, GitHub Actions |

## Project structure

```
fair-split-frontend/    -> Next.js UI (see its own README for setup)
fair-split-springboot/  -> Spring Boot API (see its own README for setup)
manual-testing/         -> Excel test cases + Postman collection
api-tests/              -> REST Assured + TestNG suite
ui-tests/                -> Selenium + Cucumber BDD suite
docs/                    -> Testing strategy, verified calculation scenarios
```

## Running it locally

Two terminals:

```bash
# Terminal 1 — backend
cd fair-split-springboot
mvn spring-boot:run

# Terminal 2 — frontend
cd fair-split-frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## The algorithm, briefly

1. **Compute balances** — for each person: (amount they paid) − (their fair
   share of everything). Positive = owed money, negative = owes money.
2. **Greedily settle** — repeatedly match the biggest creditor with the
   biggest debtor, paying off as much as possible, until everyone nets to
   zero. This minimizes the total number of transactions.

See [`docs/settlement-test-scenarios.md`] for 10 verified
worked examples with exact expected outputs.

## Known issues / roadmap

- In-memory storage only — data resets when the backend restarts
- No authentication — group access is by (non-guessable) URL only
- API/UI test automation and CI/CD pipeline in progress
