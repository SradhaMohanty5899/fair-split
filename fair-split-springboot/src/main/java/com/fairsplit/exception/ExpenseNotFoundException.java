package com.fairsplit.exception;

public class ExpenseNotFoundException extends RuntimeException {
    public ExpenseNotFoundException(String expenseId) {
        super("Expense not found: " + expenseId);
    }
}
