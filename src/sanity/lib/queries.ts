import { groq } from "next-sanity";

const imageProjection = groq`{
  alt,
  "asset": asset->{
    _id,
    url,
    metadata { lqip, dimensions { width, height, aspectRatio } }
  }
}`;

const seoProjection = groq`{
  "title": metaTitle,
  "description": metaDescription,
  "ogImage": ogImage${imageProjection},
  canonicalUrl,
  noIndex
}`;

const ctaProjection = groq`{
  "label": label,
  href,
  variant
}`;

const navLinkProjection = groq`{
  "label": label,
  href
}`;

export const HOMEPAGE_QUERY = groq`
  *[_type == "homepage"][0]{
    _id,
    _updatedAt,
    seo${seoProjection},
    hero{
      eyebrow,
      headline,
      subheadline,
      primaryCta${ctaProjection},
      secondaryCta${ctaProjection},
      image${imageProjection},
      stats[]{ value, label },
      foodLabels[]{ name, rating, ratingType, accent },
      appBadges{
        playStoreUrl,
        appStoreUrl,
        googleReviewUrl,
        googleRatingValue,
        googleRatingScale
      }
    },
    logoBar{
      heading,
      logos[]${imageProjection}
    },
    productsSection{
      headingLine1,
      headingLine2,
      items[]{
        tag,
        title,
        ratingPercent,
        reviewCount,
        image${imageProjection}
      },
      cta${ctaProjection}
    },
    cultureSection{
      heading,
      stats[]{ value, title, body },
      timeline[]{ title, body },
      image${imageProjection}
    },
    taxCtaSection{
      headline,
      dishName,
      salePrice,
      listPrice,
      savingsLabel,
      cta${ctaProjection}
    },
    stepsSection{
      headingLine1,
      headingLine2,
      steps[]{ stepLabel, title, body },
      cta${ctaProjection}
    },
    pricingSection{
      heading,
      daysQuestion,
      employeesQuestion,
      subsidyQuestion,
      emailPrompt,
      employeeResult{ heading, value, caption, note },
      companyResult{ heading, value, caption, note },
      cta${ctaProjection}
    },
    testimonialsSection{
      heading,
      quote,
      authorName,
      authorRole
    },
    contactSection{
      headline,
      body,
      contactName,
      contactEmail,
      contactPhone,
      formHeading,
      consentText,
      submitLabel
    },
    supportSection{
      heading,
      body,
      cta${ctaProjection}
    },
    faqSection{
      heading,
      items[]{ question, answer }
    },
    finalCta{
      headline,
      body,
      primaryCta${ctaProjection}
    }
  }
`;

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0]{
    _id,
    _updatedAt,
    organization{
      legalName,
      url,
      logo${imageProjection},
      sameAs
    },
    header{
      logo${imageProjection},
      links[]${navLinkProjection},
      secondaryLink${navLinkProjection},
      cta${ctaProjection}
    },
    footer{
      tagline,
      followUs{
        heading,
        body,
        contactEmail,
        socialLinks[]{ platform, url }
      },
      columns[]{
        heading,
        links[]${navLinkProjection}
      },
      legalLinks[]${navLinkProjection},
      copyright
    }
  }
`;
