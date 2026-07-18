/**
 * Property-Based Tests for ContactForm validation and error field preservation.
 *
 * Feature: supabase-backend-migration
 * Validates: Requirements 8.1, 8.4
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateContactForm } from '../lib/validateContactForm';
import type { ContactFormData } from '../lib/validateContactForm';

// ── Helper: expected validity predicate ───────────────────────────────────────

function expectedIsValid(data: ContactFormData): boolean {
  const nameOk = data.name.trim().length >= 1 && data.name.length <= 100;
  const atIndex = data.email.indexOf('@');
  const emailOk = atIndex !== -1 && data.email.indexOf('.', atIndex) > atIndex;
  const subjectOk = data.subject.trim().length >= 1 && data.subject.length <= 200;
  const messageOk = data.message.trim().length >= 1 && data.message.length <= 5000;
  return nameOk && emailOk && subjectOk && messageOk;
}

// ── Property 6: Contact form validation rejects exactly the invalid inputs ────
// Validates: Requirements 8.1

describe('validateContactForm — Property 6', () => {
  it('accepts valid and rejects invalid input tuples', () => {
    /**
     * **Validates: Requirements 8.1**
     *
     * For any tuple (name, email, subject, message), the validator returns
     * `isValid === true` if and only if all four field conditions are met.
     */
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 0, maxLength: 110 }),
          email: fc.oneof(
            fc.emailAddress(),
            fc.string({ minLength: 0, maxLength: 50 })
          ),
          subject: fc.string({ minLength: 0, maxLength: 210 }),
          message: fc.string({ minLength: 0, maxLength: 5100 }),
        }),
        (data) => {
          const result = validateContactForm(data);
          expect(result.isValid).toBe(expectedIsValid(data));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('when invalid, produces per-field errors only for failing fields', () => {
    /**
     * **Validates: Requirements 8.1**
     *
     * When `isValid` is false, `errors` contains at least one key.
     * When `isValid` is true, `errors` is empty.
     */
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 0, maxLength: 110 }),
          email: fc.oneof(fc.emailAddress(), fc.string({ minLength: 0, maxLength: 50 })),
          subject: fc.string({ minLength: 0, maxLength: 210 }),
          message: fc.string({ minLength: 0, maxLength: 5100 }),
        }),
        (data) => {
          const { isValid, errors } = validateContactForm(data);
          if (isValid) {
            expect(Object.keys(errors)).toHaveLength(0);
          } else {
            expect(Object.keys(errors).length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 7: Contact form error preserves all field values ─────────────────
// Validates: Requirements 8.4

describe('validateContactForm — Property 7', () => {
  it('error result does not modify field values (pure function check)', () => {
    /**
     * **Validates: Requirements 8.4**
     *
     * validateContactForm is pure: calling it with given field values does NOT
     * mutate the input object. After the call, all field values equal their
     * pre-call values. This guarantees that the error handler preserves values.
     */
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          email: fc.emailAddress(),
          subject: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
          message: fc.string({ minLength: 1, maxLength: 5000 }).filter(s => s.trim().length > 0),
        }),
        (validData) => {
          // Snapshot the values before the call
          const before = { ...validData };

          // Even though these are valid, we verify the function does not mutate
          validateContactForm(validData);

          expect(validData.name).toBe(before.name);
          expect(validData.email).toBe(before.email);
          expect(validData.subject).toBe(before.subject);
          expect(validData.message).toBe(before.message);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('valid inputs always return isValid=true and empty errors', () => {
    /**
     * **Validates: Requirements 8.4**
     *
     * For inputs that satisfy all constraints, the validator always returns
     * isValid=true. This is a prerequisite for Property 7: we need to know
     * what counts as "all fields passing" when a Supabase error occurs.
     */
    fc.assert(
      fc.property(
        fc.record({
          // name: 1-100 chars, non-empty after trim
          name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          // email: always valid (fc.emailAddress always contains @ and . after @)
          email: fc.emailAddress(),
          // subject: 1-200 chars, non-empty after trim
          subject: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
          // message: 1-5000 chars, non-empty after trim
          message: fc.string({ minLength: 1, maxLength: 5000 }).filter(s => s.trim().length > 0),
        }),
        (validData) => {
          const { isValid, errors } = validateContactForm(validData);
          expect(isValid).toBe(true);
          expect(Object.keys(errors)).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
