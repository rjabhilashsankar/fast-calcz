import GPACalculator from "../gpa-calculator";

export const metadata = {
  title: "Free GPA Calculator - Support for US 4.0, Indian CGPA, UK, German & 10+ Grading Systems",
  description: "Calculate GPA using US 4.0 scale, Indian 10-point CGPA, UK degree classification, German grading scale, and 10+ international systems. Free cumulative GPA calculator with target GPA planner, semester tracking, and custom grading scales. Accurate GPA calculation for high school, college, and university students worldwide.",
  keywords: "GPA calculator, CGPA calculator, grade point average calculator, US 4.0 GPA, Indian CGPA 10 point, UK degree classification calculator, German grading system converter, cumulative GPA calculator, semester GPA, target GPA calculator, international GPA converter, Australia GPA, Canada GPA, Singapore GPA, France grading, Netherlands grading, China GPA converter, custom GPA scale",
};

export default function GPAPage() {
  return <GPACalculator />;
}