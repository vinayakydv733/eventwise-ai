import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, slugify, getDaysRemaining } from '../lib/utils';

describe('Utility Functions', () => {
  it('formats currency in INR correctly', () => {
    const formatted = formatCurrency(250000, 'INR', 'en-IN');
    assert.ok(formatted.includes('2,50,000'));
  });

  it('generates URL-safe slugs', () => {
    assert.equal(slugify('Ananya & Rohan Wedding 2026!'), 'ananya-rohan-wedding-2026');
    assert.equal(slugify('Tech-Community Meetup #1'), 'tech-community-meetup-1');
  });

  it('calculates countdown days correctly', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const countdown = getDaysRemaining(futureDate);
    assert.equal(countdown.days, 10);
    assert.equal(countdown.isPast, false);
  });
});
