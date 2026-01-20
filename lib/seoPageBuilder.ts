// File: /src/lib/seoPageBuilder.ts
import { seoIntentGraph } from "./seoIntentGraph";

export interface SEOMetadata {
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: { q: string; a: string }[];
}

export function getSEOMetadata(href: string): SEOMetadata {
  const page = seoIntentGraph.find((p) => p.href === href);

  if (!page) {
    // fallback metadata if page is not in the graph
    return {
      title: "Free Online Calculators",
      description: "Access a collection of free online calculators for finance, health, education, and daily life.",
      h1: "Free Online Calculators",
      intro: "Instantly calculate discounts, EMI, BMI, calories, GPA, age, tips, and more.",
      keywords: ["calculator", "online calculator", "free calculator", "discount", "EMI", "BMI", "GPA", "age"],
      faqs: [],
    };
  }

  return {
    title: page.title,
    description: page.metaDescription,
    h1: page.h1,
    intro: page.intro,
    keywords: page.keywords,
    faqs: page.faqs,
  };
}