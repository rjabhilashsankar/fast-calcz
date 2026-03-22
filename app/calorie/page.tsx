import { Metadata } from "next";
import CalorieCalculator from "../calorie-calculator";
import { getPageSEO } from "@/lib/usePageSEO";
export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEO("/calorie");  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'website',
    },
  };
}
export default function CaloriePage() {
  return <CalorieCalculator />;
}