import { seoIntentGraph, SEOPageData } from "./seoIntentGraph";

export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  h1?: string;
  intro?: string;
  faqs?: Array<{ q: string; a: string }>;
  category?: string;
}

const DEFAULT_SEO: PageSEO = {
  title: "Free Online Calculators – Mortgage, EMI, BMI, GPA & More",
  description: "Free online calculators for finance, health, academics, and daily life. Calculate mortgage payments, loan EMI, BMI, GPA, discounts, tips, and more instantly.",
  keywords: "calculator, free online calculator, mortgage calculator, EMI calculator, BMI calculator, GPA calculator, discount calculator, tip calculator, age calculator, calorie calculator",
};

/**
 * Get SEO data for a specific page (SERVER-SIDE SAFE)
 * Use this in generateMetadata() and server components
 */
export function getPageSEO(href: string): PageSEO {
  const normalizedHref = href.trim().replace(/\/+$/, '') || '/';
  
  if (normalizedHref === '/' || normalizedHref === '') {
    return {
      title: "Instant Calculators for Real Life – Mortgage, EMI, BMI, GPA & More",
      description: "Mortgage, EMI, BMI, GPA, discounts, calories, tips — all in one place. Instant results. No signup. No ads. Fast and accurate calculators for everyday use.",
      keywords: "mortgage calculator, loan EMI calculator, BMI calculator, calorie calculator, GPA calculator, age calculator, tip calculator, discount calculator, percentage calculator, bill splitter",
    };
  }

  const pageData: SEOPageData | undefined = seoIntentGraph.find(
    (item) => item.href === normalizedHref
  );

  if (pageData) {
    return {
      title: pageData.title,
      description: pageData.metaDescription,
      keywords: pageData.keywords.join(", "),
      h1: pageData.h1,
      intro: pageData.intro,
      faqs: pageData.faqs,
      category: pageData.category,
    };
  }

  const pageName = normalizedHref
    .split('/')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    ...DEFAULT_SEO,
    title: pageName 
      ? `${pageName} Calculator – ${DEFAULT_SEO.title.split('–')[1]?.trim() || 'Free Online Tool'}`
      : DEFAULT_SEO.title,
  };
}

/**
 * CLIENT-SIDE hook version (for use in React components)
 * DO NOT use in generateMetadata()
 */
export function usePageSEO(href: string): PageSEO {
  return getPageSEO(href);
}

// ... rest of your existing functions
export function getAllCalculatorPaths(): string[] {
  return seoIntentGraph.map(item => item.href);
}

export function getCalculatorsByCategory(category: string): SEOPageData[] {
  return seoIntentGraph.filter(item => item.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(seoIntentGraph.map(item => item.category)));
}

export function searchCalculators(query: string): SEOPageData[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];
  return seoIntentGraph.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.metaDescription.toLowerCase().includes(lowerQuery) ||
    item.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
    item.intents.some(intent => intent.toLowerCase().includes(lowerQuery))
  );
}
