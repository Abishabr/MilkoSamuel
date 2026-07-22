/**
 * Converts a title into a URL-safe slug: lowercase, accents stripped,
 * non-alphanumerics collapsed to single hyphens, trimmed.
 *
 *   "Nexus Finance — 2024!"  ->  "nexus-finance-2024"
 *
 * Mirrors the database `slugify()` used by the projects slug trigger, so the
 * admin preview matches what the server will store.
 */
export function slugify(value: string): string {
  return (value || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Produces a slug guaranteed unique against a set of existing slugs by
 * appending -2, -3, … as needed. `currentSlug` is preserved (excluded from the
 * collision set) so editing a project without renaming it keeps its slug.
 */
export function uniqueSlug(
  title: string,
  existing: Iterable<string>,
  currentSlug?: string,
): string {
  const base = slugify(title) || "project";
  const taken = new Set(existing);
  if (currentSlug) taken.delete(currentSlug);

  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}
