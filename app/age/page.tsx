import AgeCalculator from "../age-calculator";
import { usePageSEO } from "@/lib/usePageSEO";
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  const seo = usePageSEO("/age"); 
  
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
export default function AgePage() {
  return <AgeCalculator />;
}