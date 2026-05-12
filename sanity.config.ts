import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioPath } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";

/**
 * Studio runs embedded in the Next.js app at /studio.
 * Editors authenticate against Sanity and never leave the marketing site.
 *
 * basePath is critical — without it, internal navigation inside the Studio
 * generates absolute URLs that 404.
 */
export default defineConfig({
  basePath: studioPath,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Vision lets editors run GROQ queries against the dataset from the Studio
    // — invaluable for debugging the same queries the app uses.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
