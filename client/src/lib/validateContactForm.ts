/**
 * Pure contact form validation — no Supabase dependency.
 * Exported separately so it can be imported in tests without triggering
 * the Supabase client initialization guard.
 */

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface ContactFormValidationResult {
  isValid: boolean;
  errors: ContactFormErrors;
}

/**
 * Validates contact form fields:
 * - name: non-empty (after trim) and ≤ 100 chars
 * - email: contains @ and at least one . after the @
 * - subject: non-empty (after trim) and ≤ 200 chars
 * - message: non-empty (after trim) and ≤ 5000 chars
 *
 * Returns `{ isValid, errors }` where errors only contains keys for failing fields.
 */
export function validateContactForm(data: ContactFormData): ContactFormValidationResult {
  const errors: ContactFormErrors = {};

  // name: non-empty and ≤ 100 chars
  if (data.name.trim().length === 0) {
    errors.name = 'Name is required.';
  } else if (data.name.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  // email: contains @ and a . after the @
  const atIndex = data.email.indexOf('@');
  if (atIndex === -1) {
    errors.email = 'Email must contain @.';
  } else if (data.email.indexOf('.', atIndex) <= atIndex) {
    errors.email = 'Email must contain a . after the @.';
  }

  // subject: non-empty and ≤ 200 chars
  if (data.subject.trim().length === 0) {
    errors.subject = 'Subject is required.';
  } else if (data.subject.length > 200) {
    errors.subject = 'Subject must be 200 characters or fewer.';
  }

  // message: non-empty and ≤ 5000 chars
  if (data.message.trim().length === 0) {
    errors.message = 'Message is required.';
  } else if (data.message.length > 5000) {
    errors.message = 'Message must be 5000 characters or fewer.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
