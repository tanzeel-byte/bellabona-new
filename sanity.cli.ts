import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "@/sanity/env";

/**
 * `sanity` CLI configuration. Lets us run `sanity dataset export`,
 * `sanity schema extract`, etc. without re-specifying the project each time.
 */
export default defineCliConfig({
  api: { projectId, dataset },
});
