import type { PortableTextBlock } from "@portabletext/types";

export type LocaleString = {
  en?: string;
  de?: string;
};

export type LocalePortableText = {
  en?: PortableTextBlock[];
  de?: PortableTextBlock[];
};

export type SanityImage = {
  alt?: LocaleString;
  asset: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
};

export type CtaVariant = "primary" | "secondary" | "ghost";

export type Cta = {
  label?: LocaleString;
  href?: string;
  variant?: CtaVariant;
};

export type NavLink = {
  label?: LocaleString;
  href?: string;
};

export type Seo = {
  title?: LocaleString;
  description?: LocaleString;
  ogImage?: SanityImage;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export type HeroStat = {
  value?: LocaleString;
  label?: LocaleString;
};

export type ProductCard = {
  tag?: LocaleString;
  title?: LocaleString;
  ratingPercent?: string;
  reviewCount?: string;
  image?: SanityImage;
};

export type FoodLabelAccent = "red" | "amber" | "green";
export type FoodLabelRatingType = "star" | "heart" | "leaf";

export type FoodLabel = {
  name?: LocaleString;
  rating?: string;
  ratingType?: FoodLabelRatingType;
  accent?: FoodLabelAccent;
};

export type AppBadges = {
  playStoreUrl?: string;
  appStoreUrl?: string;
  googleReviewUrl?: string;
  googleRatingValue?: string;
  googleRatingScale?: string;
  playStoreBadgeImage?: SanityImage;
};

export type Homepage = {
  _id: string;
  _updatedAt: string;
  seo?: Seo;
  hero?: {
    eyebrow?: LocaleString;
    headline?: LocaleString;
    subheadline?: LocalePortableText;
    primaryCta?: Cta;
    secondaryCta?: Cta;
    image?: SanityImage;
    stats?: HeroStat[];
    foodLabels?: FoodLabel[];
    appBadges?: AppBadges;
  };
  logoBar?: {
    heading?: LocaleString;
    logos?: SanityImage[];
  };
  productsSection?: {
    headingLine1?: LocaleString;
    headingLine2?: LocaleString;
    items?: ProductCard[];
    cta?: Cta;
  };
  cultureSection?: {
    heading?: LocaleString;
    stats?: Array<{
      value?: LocaleString;
      title?: LocaleString;
      body?: LocaleString;
    }>;
    timeline?: Array<{
      title?: LocaleString;
      body?: LocaleString;
    }>;
    image?: SanityImage;
  };
  taxCtaSection?: {
    headline?: LocaleString;
    cta?: Cta;
    dishName?: LocaleString;
    salePrice?: LocaleString;
    listPrice?: LocaleString;
    savingsLabel?: LocaleString;
    dishImage?: SanityImage;
  };
  stepsSection?: {
    headingLine1?: LocaleString;
    headingLine2?: LocaleString;
    deliveryPhoto?: SanityImage;
    routeOverlayPhoto?: SanityImage;
    steps?: Array<{
      stepLabel?: LocaleString;
      title?: LocaleString;
      body?: LocaleString;
    }>;
    cta?: Cta;
  };
  pricingSection?: {
    heading?: LocaleString;
    daysQuestion?: LocaleString;
    employeesQuestion?: LocaleString;
    subsidyQuestion?: LocaleString;
    defaultDays?: number;
    employeesMin?: number;
    employeesMax?: number;
    defaultEmployees?: number;
    subsidyMin?: number;
    subsidyMax?: number;
    defaultSubsidy?: number;
    mealPriceMin?: number;
    mealPriceMax?: number;
    participationRate?: number;
    emailPrompt?: LocaleString;
    employeeResult?: PricingResultCard;
    companyResult?: PricingResultCard;
    cta?: Cta;
  };
  testimonialsSection?: {
    heading?: LocaleString;
    quote?: LocaleString;
    authorName?: LocaleString;
    authorRole?: LocaleString;
    items?: Array<{
      quote?: LocaleString;
      authorName?: LocaleString;
      authorRole?: LocaleString;
      photo?: SanityImage;
    }>;
    leftPhoto?: SanityImage;
    rightPhoto?: SanityImage;
  };
  contactSection?: {
    headline?: LocaleString;
    body?: LocaleString;
    contactName?: LocaleString;
    contactEmail?: LocaleString;
    contactPhone?: LocaleString;
    formHeading?: LocaleString;
    consentText?: LocaleString;
    submitLabel?: LocaleString;
    portraitImage?: SanityImage;
  };
  supportSection?: {
    heading?: LocaleString;
    body?: LocaleString;
    panelImage?: SanityImage;
    cta?: Cta;
  };
  faqSection?: {
    heading?: LocaleString;
    items?: Array<{
      question?: LocaleString;
      answer?: LocaleString;
    }>;
  };
  features?: {
    eyebrow?: LocaleString;
    heading?: LocaleString;
    description?: LocaleString;
    items?: FeatureItem[];
  };
  finalCta?: {
    headline?: LocaleString;
    body?: LocaleString;
    primaryCta?: Cta;
  };
};

export type FeatureIcon =
  | "leaf"
  | "chef"
  | "truck"
  | "phone"
  | "coin"
  | "bowl"
  | "star"
  | "handshake";

export type FeatureItem = {
  icon?: FeatureIcon;
  title?: LocaleString;
  description?: LocaleString;
};

export type PricingResultCard = {
  heading?: LocaleString;
  value?: LocaleString;
  caption?: LocaleString;
  note?: LocaleString;
};

export type SiteSettings = {
  _id: string;
  _updatedAt: string;
  organization?: {
    legalName?: string;
    url?: string;
    logo?: SanityImage;
    sameAs?: string[];
  };
  header?: {
    logo?: SanityImage;
    links?: NavLink[];
    secondaryLink?: NavLink;
    cta?: Cta;
  };
  footer?: {
    tagline?: LocaleString;
    followUs?: {
      heading?: LocaleString;
      body?: LocaleString;
      contactEmail?: string;
      socialLinks?: SocialLink[];
    };
    columns?: Array<{
      heading?: LocaleString;
      links?: NavLink[];
    }>;
    legalLinks?: NavLink[];
    copyright?: LocaleString;
  };
};

export type SocialPlatform =
  | "google"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "facebook"
  | "youtube"
  | "appstore"
  | "playstore";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};
