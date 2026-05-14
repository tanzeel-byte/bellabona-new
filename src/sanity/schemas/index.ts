import type { SchemaTypeDefinition } from "sanity";

import { homepage } from "./documents/homepage";
import { siteSettings } from "./documents/siteSettings";
import { cta } from "./objects/cta";
import { cultureStat, cultureTimelineItem } from "./objects/cultureSection";
import {
  homepageFaqItem,
  homepageStep,
  pricingResultCard,
  testimonialItem,
} from "./objects/homepageSections";
import { featureItem } from "./objects/featureItem";
import { hero } from "./objects/hero";
import { localePortableText } from "./objects/localePortableText";
import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { navLink } from "./objects/navLink";
import { productCard } from "./objects/productCard";
import { seo } from "./objects/seo";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Reusable objects
  localeString,
  localeText,
  localePortableText,
  seo,
  cta,
  navLink,
  hero,
  featureItem,
  productCard,
  cultureStat,
  cultureTimelineItem,
  homepageStep,
  pricingResultCard,
  testimonialItem,
  homepageFaqItem,

  // Documents (singletons)
  homepage,
  siteSettings,
];
