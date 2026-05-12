import type { StructureResolver } from "sanity/structure";
import { CogIcon, HomeIcon } from "@sanity/icons";

/**
 * Custom Studio structure that surfaces both singletons (homepage, siteSettings)
 * as direct top-level items instead of generic "Document" lists. Editors get a
 * one-click path to the content they actually maintain, and the "+ New" menu
 * cannot duplicate either document because we don't expose them as a list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .icon(HomeIcon)
        .child(
          S.editor()
            .id("homepage")
            .schemaType("homepage")
            .documentId("homepage"),
        ),
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== undefined &&
          !["homepage", "siteSettings"].includes(item.getId() as string),
      ),
    ]);
