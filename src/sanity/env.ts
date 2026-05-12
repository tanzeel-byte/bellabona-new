/**
 * Sanity environment configuration. Validated at module load so a misconfig
 * fails fast at boot rather than surfacing as a confusing 500 in production.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required Sanity env var: ${name}. Check .env.local against .env.example.`,
    );
  }
  return value;
}

export const projectId = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);

export const dataset = required(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

// Server-only — never imported into client components.
// Optional: if the dataset is public, the read token is not required.
export const readToken = process.env.SANITY_API_READ_TOKEN;

export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;

// Path where the embedded Studio is mounted (handy for revalidation excludes etc.)
export const studioPath = "/studio";
