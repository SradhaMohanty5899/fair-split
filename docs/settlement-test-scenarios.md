# Fair Split — 10 Test Scenarios (Verified Calculations)

All expected results below were computed by running the actual settlement
algorithm (`SettlementService.java`). Use these as ground truth for API
tests, UI/BDD tests, and manual exploratory testing.

**Balance sign convention:** positive = this person is owed money (a creditor),
negative = this person owes money (a debtor).

---

## 1. Uneven subset splits (the trip example)
**Members:** A, B, C, D
| Expense | Paid by | Amount | Split among |
|---|---|---|---|
| Hotel | A | ₹2000 | A, B, C, D |
| Dinner | B | ₹1200 | A, B, C, D |
| Cab | C | ₹800 | A, B, C (D excluded) |

**Expected balances:** A: +933.33, B: +133.33, C: −266.67, D: −800.00

**Expected transactions (3):**
- D → A : ₹800.00
- C → A : ₹133.33
- C → B : ₹133.33

**Why it's a good test:** mixed subset sizes (4-way and 3-way splits in the
same group) — catches bugs where the split denominator isn't recalculated
per-expense.

---

## 2. Non-divisible amount (rounding stress test)
**Members:** A, B, C
| Expense | Paid by | Amount | Split among |
|---|---|---|---|
| Snacks | A | ₹100 | A, B, C |

₹100 ÷ 3 = ₹33.333... — does not divide evenly.

**Expected balances:** A: +66.67, B: −33.33, C: −33.33

**Expected transactions (2):**
- B → A : ₹33.33
- C → A : ₹33.33

**Why it's a good test:** verifies 2-decimal rounding is applied consistently
and the sum of transactions still equals the original ₹100 (33.33+33.33+33.34
paid in, 66.67+33.33 paid out — check both sides reconcile).

---

## 3. Circular debt that nets to exactly zero
**Members:** A, B, C
| Expense | Paid by | Amount | Split among |
|---|---|---|---|
| Item 1 | A | ₹300 | A, B |
| Item 2 | B | ₹300 | B, C |
| Item 3 | C | ₹300 | C, A |

**Expected balances:** A: 0, B: 0, C: 0

**Expected transactions: 0** — "message: No settlement needed" or empty array,
depending on how you surface it.

**Why it's a good test:** a naive implementation might still generate
transactions if it doesn't check for near-zero balances (epsilon threshold)
before adding a transaction — this catches that bug directly.

---

## 4. Single payer for the entire trip
**Members:** A, B, C, D
| Expense | Paid by | Amount | Split among |
|---|---|---|---|
| Everything | A | ₹4000 | A, B, C, D |

**Expected balances:** A: +3000, B: −1000, C: −1000, D: −1000

**Expected transactions (3):** B → A ₹1000, C → A ₹1000, D → A ₹1000

**Why it's a good test:** the simplest possible non-trivial case — good smoke
test / first test to write, and a clean baseline if something more complex breaks.

---

## 5. Same person flips between creditor and debtor
**Members:** A, B, C
| Expense | Paid by | Amount | Split among |
|---|---|---|---|
| Item 1 | A | ₹900 | A, B, C |
| Item 2 | B | ₹900 | A, B, C |
| Item 3 | A | ₹300 | A, B |

**Expected balances:** A: +450, B: +150, C: −600

**Expected transactions (2):** C → A ₹450, C → B ₹150

**Why it's a good test:** A is a net creditor here despite having *paid into*
some expenses too — catches bugs where a person's own contributions to a group
expense aren't being netted against what they owe.

---

## 6. Multiple expenses, no rounding involved
**Members:** A, B, C, D
| Expense | Paid by | Amount | Split among |
|---|---|---|---|
| Item 1 | A | ₹1200 | A, B, C, D |
| Item 2 | C | ₹800 | A, B, C, D |

**Expected balances:** A: +700, B: −500, C: +300, D: −500

**Expected transactions (3):**
- B → A : ₹500
- D → C : ₹300
- D → A : ₹200

**Why it's a good test:** two creditors (A and C) and two debtors (B and D) —
verifies the greedy algorithm correctly picks the *biggest* creditor/debtor
pairing at each step rather than pairing arbitrarily. D's ₹500 debt gets
split across two different creditors (₹300 + ₹200), which is exactly the
"minimum transactions" behavior worth asserting on.

---

## 7. Five-member group, skewed contributions
**Members:** A, B, C, D, E
| Expense | Paid by | Amount | Split among |
|---|---|---|---|
| Item 1 | A | ₹5000 | A, B, C, D, E |
| Item 2 | B | ₹1000 | A, B, C, D, E |

**Expected balances:** A: +3800, B: −200, C: −1200, D: −1200, E: −1200

**Expected transactions (4):** C → A ₹1200, D → A ₹1200, E → A ₹1200, B → A ₹200

**Why it's a good test:** naive pairwise settlement (everyone-pays-everyone)
would need up to 10 transactions for 5 people; this confirms the algorithm
gets it down to 4 — a good one to explicitly assert `transactionCount < naive count`.

---

## 8. Excluded member ("loner") + solo expense
**Members:** A, B, C, D
| Expense | Paid by | Amount | Split among |
|---|---|---|---|
| Item 1 | A | ₹1000 | A, B, C (D excluded) |
| Item 2 | B | ₹600 | A, B, C (D excluded) |
| Item 3 | D | ₹200 | D only |

**Expected balances:** A: +466.67, B: +66.67, C: −533.33, D: 0

**Expected transactions (2):**
- C → A : ₹466.67
- C → B : ₹66.66 ⚠️

**Why it's a good test — and a real bug-hunting note:** notice B's balance is
+66.67 but the actual transaction pays only ₹66.66. That's not a typo — it's
the greedy algorithm's remainder after C pays A first. **This is a genuinely
useful edge case to write an assertion for**: sum of transactions into a
person should equal their balance within rounding tolerance, and total money
in must equal total money out. If your test asserts exact equality without a
tolerance, this scenario will (correctly) fail and you'll need to decide how
much float tolerance is acceptable — that's a real design conversation worth
having, not just a test to pass.

---

## 9. Fully symmetric round-robin
**Members:** A, B, C, D
| Expense | Paid by | Amount | Split among |
|---|---|---|---|
| Item 1 | A | ₹400 | A, B, C, D |
| Item 2 | B | ₹400 | A, B, C, D |
| Item 3 | C | ₹400 | A, B, C, D |
| Item 4 | D | ₹400 | A, B, C, D |

**Expected balances:** A: 0, B: 0, C: 0, D: 0

**Expected transactions: 0**

**Why it's a good test:** everyone paid the same amount for the same group —
should collapse to nothing, same class of bug as scenario 3 but reached via
multiple expenses instead of one circular pattern.

---

## 10. Large group (6 members), mixed overlapping subsets
**Members:** A, B, C, D, E, F
| Expense | Paid by | Amount | Split among |
|---|---|---|---|
| Item 1 | A | ₹3000 | A, B, C, D, E, F |
| Item 2 | B | ₹1800 | A, B, C, D, E, F |
| Item 3 | C | ₹900 | A, B, C, D |
| Item 4 | D | ₹450 | D, E, F |
| Item 5 | F | ₹1200 | A, F |

**Expected balances:** A: +1375, B: +775, C: −125, D: −725, E: −950, F: −350

**Expected transactions (5):**
- E → A : ₹950
- D → B : ₹725
- F → A : ₹350
- C → A : ₹75
- C → B : ₹50

**Why it's a good test:** this is your "everything at once" regression test —
overlapping subsets, multiple creditors and debtors, a person (F) who is both
a payer and a heavy debtor at the same time. Good candidate for a TestNG
`@DataProvider` case or a full end-to-end UI/BDD scenario.

---

## How to use these

- **API tests:** turn each row-set into a REST Assured test like the
  `SettlementApiTest` example — POST the expenses, GET `/settle`, assert
  balances and transactions match exactly (within 0.01 tolerance for floats).
- **Data-driven testing:** these 10 map cleanly to a TestNG `@DataProvider` —
  same test method, 10 rows of input/expected-output pairs.
- **BDD/Selenium:** scenarios 1, 3, and 8 are the most interesting to turn
  into Gherkin — they have a "story" (uneven trip, debts canceling out, an
  excluded member) that's easy to write a natural scenario around.
- **Sanity check for future changes:** if you ever refactor `SettlementService.java`
  (e.g. change how rounding works, or optimize the greedy matching), re-run
  these 10 scenarios first — they're your regression baseline. If any number
  here changes unexpectedly after a "harmless" refactor, that's a real bug,
  not a coincidence.