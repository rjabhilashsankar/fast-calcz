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

// Default/fallback SEO data
const DEFAULT_SEO: PageSEO = {
  title: "Free Online Calculators – Mortgage, EMI, BMI, GPA & More",
  description: "Free online calculators for finance, health, academics, and daily life. Calculate mortgage payments, loan EMI, BMI, GPA, discounts, tips, and more instantly.",
  keywords: "calculator, free online calculator, mortgage calculator, EMI calculator, BMI calculator, GPA calculator, discount calculator, tip calculator, age calculator, calorie calculator",
};

/**
 * Get SEO data for a specific page
 * @param href - The page path (e.g., "/mortgage", "/bmi")
 * @returns SEO metadata for the page
 */
export function usePageSEO(href: string): PageSEO {
  // Normalize the href (remove trailing slashes, ensure leading slash)
  const normalizedHref = href.trim().replace(/\/+$/, '') || '/';
  
  // Find matching page data
  const pageData: SEOPageData | undefined = seoIntentGraph.find(
    (item) => item.href === normalizedHref
  );

  // Return default SEO for homepage
  if (normalizedHref === '/' || normalizedHref === '') {
    return {
      title: "Instant Calculators for Real Life – Mortgage, EMI, BMI, GPA & More",
      description: "Mortgage, EMI, BMI, GPA, discounts, calories, tips — all in one place. Instant results. No signup. No ads. Fast and accurate calculators for everyday use.",
      keywords: "mortgage calculator, loan EMI calculator, BMI calculator, calorie calculator, GPA calculator, age calculator, tip calculator, discount calculator, percentage calculator, bill splitter",
    };
  }

  // Return page-specific SEO if found
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

  // Log warning in development if page not found
  if (process.env.NODE_ENV === 'development') {
    console.warn(`SEO data not found for: ${normalizedHref}. Using default fallback.`);
  }

  // Return fallback SEO with dynamic title based on href
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
 * Get all available calculator paths
 * Useful for generating sitemaps or navigation
 */
export function getAllCalculatorPaths(): string[] {
  return seoIntentGraph.map(item => item.href);
}

/**
 * Get calculators by category
 */
export function getCalculatorsByCategory(category: string): SEOPageData[] {
  return seoIntentGraph.filter(item => item.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(seoIntentGraph.map(item => item.category)));
}

/**
 * Search calculators by keyword or intent
 */
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