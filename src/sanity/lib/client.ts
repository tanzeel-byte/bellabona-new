import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, readToken } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Edge-cached, eventually consistent. Perfect for ISR-shaped content.
  perspective: "published",
  stega: false,
});

// Server-only: carries the read token, bypasses CDN.
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: readToken,
  useCdn: false,
  perspective: "published",
  stega: false,
});
