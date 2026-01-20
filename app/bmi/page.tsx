import BMICalculator from "../bmi-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export const metadata = usePageSEO("/bmi");

export default function BMIPage() {
  return <BMICalculator />;
}