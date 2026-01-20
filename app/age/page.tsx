import AgeCalculator from "../age-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export const metadata = usePageSEO("/age");

export default function AgePage() {
  return <AgeCalculator />;
}