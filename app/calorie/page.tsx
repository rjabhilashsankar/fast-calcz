import CalorieCalculator from "../calorie-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export const metadata = usePageSEO("/calorie");

export default function CaloriePage() {
  return <CalorieCalculator />;
}