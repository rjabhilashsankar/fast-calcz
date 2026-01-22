import { Metadata } from "next";
import MortgageCalculator from "../mortgage-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export async function generateMetadata(): Promise<Metadata> {
  const seo = usePageSEO("/mortgage");  
  
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
export default function MortgagePage() {
  return <MortgageCalculator />;
}