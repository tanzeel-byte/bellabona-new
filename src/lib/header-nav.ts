/** "More" scrolls here on the homepage instead of following CMS href. */
export const HEADER_MORE_SECTION_ID = "faq-heading";

export function isDailyLunchNav(label: string, href: string) {
  return (
    /\/lunch\/?$/i.test(href.trim()) ||
    /daily\s*lunch|tägliches\s*mittagessen/i.test(label)
  );
}

export function isMoreNav(label: string) {
  return /more|mehr/i.test(label);
}
