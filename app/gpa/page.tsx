import { usePageSEO } from "@/lib/usePageSEO";
import GPACalculator from "../gpa-calculator";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = usePageSEO("/gpa");  
  
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

export default function GPAPage() {
  return <GPACalculator />;
}