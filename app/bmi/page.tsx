import { Metadata } from "next";
import BMICalculator from "../bmi-calculator";
import { getPageSEO } from "@/lib/usePageSEO";

export async function generateMetadata(): Promise<Metadata> {
const seo = getPageSEO("/bmi");   
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
export default function BMIPage() {
  return <BMICalculator />;
}