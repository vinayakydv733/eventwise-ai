import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateDeterministicPlan } from '../lib/ai/templates';
import { AIPlanSchema } from '../lib/ai/schemas';

describe('AI Multi-Agent Deterministic Fallback & Schema Validation', () => {
  it('generates a valid schema-compliant plan for a wedding', () => {
    const weddingPlan = generateDeterministicPlan({
      title: 'Udaipur Garden Wedding',
      type: 'WEDDING',
      location: 'Udaipur, Rajasthan',
      guestCount: 150,
      budgetCeiling: 1000000,
      currency: 'INR',
    });

    // Validate against strict Zod schema
    const parseResult = AIPlanSchema.safeParse(weddingPlan);
    assert.equal(parseResult.success, true);

    // Verify categories and allocations exist
    assert.ok(weddingPlan.budgetAllocations.length >= 5);
    assert.ok(weddingPlan.timeline.length >= 5);
    assert.ok(weddingPlan.vendorsNeeded.length >= 3);
    assert.equal(weddingPlan.isFallback, true);

    // Verify sum of allocations matches total budget within margin
    const sumAllocated = weddingPlan.budgetAllocations.reduce((sum, b) => sum + b.amount, 0);
    assert.ok(Math.abs(sumAllocated - 1000000) < 100);
  });

  it('generates a valid plan for a birthday celebration', () => {
    const birthdayPlan = generateDeterministicPlan({
      title: "Rhea's 18th Birthday",
      type: 'BIRTHDAY',
      location: 'Goa',
      guestCount: 40,
      budgetCeiling: 80000,
      currency: 'INR',
    });

    const parseResult = AIPlanSchema.safeParse(birthdayPlan);
    assert.equal(parseResult.success, true);
    assert.ok(birthdayPlan.summary.toLowerCase().includes('birthday'));
  });
});
