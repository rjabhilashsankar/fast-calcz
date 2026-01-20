import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Instant Calculators for Real Life – Mortgage, EMI, BMI, GPA, Discount & More",
  description:
    "Mortgage, EMI, BMI, GPA, discounts, calories, tips — all in one place. Instant results. No signup. No ads. Fast and accurate calculators for everyday use.",
  keywords:
    "mortgage calculator, loan EMI calculator, BMI calculator, calorie calculator, GPA calculator, age calculator, tip calculator, discount calculator, percentage calculator, bill splitter",
  openGraph: {
    title: "Instant Calculators for Real Life",
    description: "Mortgage, EMI, BMI, GPA, discounts, calories, tips — all in one place. Instant results. No signup.",
    type: "website",
  },
};

export default function Home() {
  return <HomeClient />;
}