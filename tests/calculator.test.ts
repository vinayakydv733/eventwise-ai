import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { auditBudget } from '../lib/finance/calculator';

describe('Budget Calculator & Financial Audit', () => {
  it('correctly calculates remaining budget and per-guest allocations', () => {
    const budgetCeiling = 500000;
    const guestCount = 100;

    const categories = [
      { id: 'cat-1', name: 'Venue', allocatedAmount: 150000 },
      { id: 'cat-2', name: 'Catering', allocatedAmount: 200000 },
      { id: 'cat-3', name: 'Contingency', allocatedAmount: 50000 },
    ];

    const expenses = [
      { categoryId: 'cat-1', amount: 100000, status: 'PAID' },
      { categoryId: 'cat-1', amount: 50000, status: 'PENDING' },
      { categoryId: 'cat-2', amount: 80000, status: 'PAID' },
    ];

    const result = auditBudget(budgetCeiling, guestCount, categories, expenses);

    assert.equal(result.budgetCeiling, 500000);
    assert.equal(result.totalAllocated, 400000); // 150k + 200k + 50k
    assert.equal(result.totalActualSpent, 180000); // 100k + 80k paid
    assert.equal(result.totalPending, 50000);
    assert.equal(result.totalCommitted, 230000); // 180k + 50k
    assert.equal(result.remainingBudget, 320000); // 500k - 180k
    assert.equal(result.isOverBudget, false);
    assert.equal(result.costPerGuestPlanned, 5000); // 500k / 100
    assert.equal(result.costPerGuestActual, 1800); // 180k / 100
  });

  it('detects over-budget and over-allocation warnings', () => {
    const budgetCeiling = 100000;
    const guestCount = 20;

    const categories = [
      { id: 'cat-1', name: 'Decor', allocatedAmount: 120000 }, // Over allocated
    ];

    const expenses = [
      { categoryId: 'cat-1', amount: 130000, status: 'PAID' }, // Over ceiling
    ];

    const result = auditBudget(budgetCeiling, guestCount, categories, expenses);

    assert.equal(result.isOverBudget, true);
    assert.ok(result.warnings.length >= 2);
  });
});
