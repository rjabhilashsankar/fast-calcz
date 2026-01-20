"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

const calculators = [
  {
    category: "Shopping & Savings",
    items: [
      {
        href: "/discount",
        emoji: "🏷️",
        title: "Discount Calculator",
        description:
          "Calculate final prices and total savings across multiple products during sales.",
        keywords: ["discount", "sale", "savings", "price", "shopping"],
      },
      {
        href: "/percentage",
        emoji: "🔢",
        title: "Percentage Calculator",
        description:
          "Solve percentage problems, increases, decreases, and comparisons instantly.",
        keywords: ["percentage", "percent", "increase", "decrease", "ratio"],
      },
    ],
  },
  {
    category: "Dining & Lifestyle",
    items: [
      {
        href: "/tip",
        emoji: "💵",
        title: "Tip Calculator",
        description:
          "Calculate tips and split bills easily for restaurants and services.",
        keywords: ["tip", "gratuity", "restaurant", "service", "dining"],
      },
      {
        href: "/bill-split",
        emoji: "🍽️",
        title: "Bill Splitter",
        description:
          "Split restaurant bills fairly with shared dishes, tax, and tip handling.",
        keywords: ["bill", "split", "divide", "share", "restaurant"],
      },
    ],
  },
  {
    category: "Health & Fitness",
    items: [
      {
        href: "/bmi",
        emoji: "⚖️",
        title: "BMI Calculator",
        description:
          "Check your Body Mass Index and understand your healthy weight range.",
        keywords: ["bmi", "body mass index", "weight", "health", "fitness"],
      },
      {
        href: "/calorie",
        emoji: "🍎",
        title: "Calorie Calculator",
        description:
          "Calculate daily calorie needs and macro targets for your fitness goals.",
        keywords: ["calorie", "calories", "diet", "nutrition", "macros"],
      },
    ],
  },
  {
    category: "Education & Academic",
    items: [
      {
        href: "/gpa",
        emoji: "🎓",
        title: "GPA Calculator",
        description:
          "Calculate GPA with US, UK, Indian, German, and 10+ international grading systems.",
        keywords: ["gpa", "cgpa", "grade", "academic", "student", "grading"],
      },
      {
        href: "/age",
        emoji: "🎂",
        title: "Age Calculator",
        description:
          "Calculate exact age with live countdown, next birthday, zodiac signs, and planetary ages.",
        keywords: ["age", "birthday", "zodiac", "date", "years"],
      },
    ],
  },
  {
    category: "Finance & Loans",
    items: [
      {
        href: "/loan",
        emoji: "💰",
        title: "Loan EMI Calculator",
        description:
          "Calculate EMI for home loans, car loans, personal loans, and no-cost EMI.",
        keywords: ["loan", "emi", "interest", "payment", "finance"],
      },
      {
        href: "/mortgage",
        emoji: "🏠",
        title: "Mortgage Calculator",
        description:
          "Calculate monthly mortgage payments with taxes, insurance, PMI, and amortization schedule.",
        keywords: ["mortgage", "home loan", "property", "payment", "amortization"],
      },
    ],
  },
];

function BasicCalculator() {
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState<string[]>([]);
  const [isResult, setIsResult] = useState(false);

  const append = (val: string) => {
    const isOperator = ["+", "-", "×", "÷", "%"].includes(val);

    if (isResult) {
      if (isOperator) {
        // Result Chaining: Move result to top and add operator
        const lastResult = display;
        setExpression(lastResult + val);
        setDisplay(lastResult + val);
        setIsResult(false);
      } else {
        // Start fresh calculation if number is pressed
        setDisplay(val);
        setExpression(val);
        setIsResult(false);
      }
      return;
    }

    if (display === "0" && !isOperator) {
      setDisplay(val);
      setExpression(val);
    } else {
      setDisplay(display + val);
      setExpression(expression + val);
    }
  };

  const clear = () => {
    setExpression("");
    setDisplay("0");
    setIsResult(false);
  };

  const calculate = () => {
    if (!expression || isResult) return;
    try {
      let formattedExpr = expression.replace(/×/g, "*").replace(/÷/g, "/");
      formattedExpr = formattedExpr.replace(/(\d+)%/g, "($1/100)");

      const result = eval(formattedExpr);
      const finalResult = Number(parseFloat(result.toFixed(8)).toString());
      
      setHistory([`${expression} = ${finalResult}`, ...history.slice(0, 9)]);
      setDisplay(String(finalResult));
      setIsResult(true);
    } catch {
      setDisplay("Error");
      setExpression("");
      setIsResult(false);
    }
  };

  const baseBtn = "h-14 rounded-xl text-lg font-bold transition-all duration-75 active:scale-95 active:translate-y-1 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none border border-black/5";
  const numBtn = `${baseBtn} bg-white text-gray-700 hover:bg-gray-50`;
  const opBtn = `${baseBtn} bg-gray-100 text-blue-600 hover:bg-blue-50`;
  const actionBtn = `${baseBtn} bg-blue-600 text-white hover:bg-blue-700 shadow-[0_4px_0_0_rgba(29,78,216,1)]`;

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start justify-center p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-[340px] bg-[#d1d5db] p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,0.5)]">
        <div className="bg-[#9ca3af] mb-6 p-4 rounded-2xl shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)] border-2 border-[#868e96] flex flex-col justify-end items-end min-h-[110px]">
          <div className="text-[#374151] text-xs font-mono mb-1 h-4 overflow-hidden opacity-70">
            {isResult ? "ANS" : expression || " "}
          </div>
          <div className="text-4xl font-mono text-[#1f2937] tracking-tighter truncate w-full text-right">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <button onClick={clear} className={`${opBtn} col-span-2 text-red-500`}>AC</button>
          <button onClick={() => append("%")} className={opBtn}>%</button>
          <button onClick={() => append("÷")} className={opBtn}>÷</button>
          {["7", "8", "9"].map(n => <button key={n} onClick={() => append(n)} className={numBtn}>{n}</button>)}
          <button onClick={() => append("×")} className={opBtn}>×</button>
          {["4", "5", "6"].map(n => <button key={n} onClick={() => append(n)} className={numBtn}>{n}</button>)}
          <button onClick={() => append("-")} className={opBtn}>−</button>
          {["1", "2", "3"].map(n => <button key={n} onClick={() => append(n)} className={numBtn}>{n}</button>)}
          <button onClick={() => append("+")} className={opBtn}>+</button>
          <button onClick={() => append("0")} className={`${numBtn} col-span-2`}>0</button>
          <button onClick={() => append(".")} className={numBtn}>.</button>
          <button onClick={calculate} className={actionBtn}>=</button>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">History</h4>
        <div className="space-y-2">
          {history.map((h, i) => (
  <div
    key={i}
    onClick={() => {
      const result = h.split("=")[1].trim();
      setDisplay(result);
      setExpression(result);
      setIsResult(true);
    }}
    className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm cursor-pointer hover:bg-gray-50"
  >
    <span className="text-gray-400 font-mono">{h.split("=")[0]}</span>
    <div className="font-bold text-gray-800">{h.split("=")[1]}</div>
  </div>
))}
        </div>
      </div>
    </div>
  );
}

export default function HomeClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCalculators = useMemo(() => {
    if (!searchQuery.trim()) return calculators;

    const query = searchQuery.toLowerCase();
    return calculators
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (calc) =>
            calc.title.toLowerCase().includes(query) ||
            calc.description.toLowerCase().includes(query) ||
            calc.keywords.some((keyword) => keyword.includes(query))
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [searchQuery]);

  const hasResults = filteredCalculators.length > 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* HERO - COMPACT */}
        <header className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Fast Calculators for Real Life
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Mortgage, EMI, BMI, GPA, discounts, calories, tips - all in one place.
          </p>
        </header>

        {/* SEARCH BAR */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search calculators (mortgage, BMI, GPA, discount...)"
              className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
           <p className="text-xs text-gray-400 mt-1">
    Try: mortgage, BMI, GPA, discount, tip
  </p>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-500">
              {hasResults
                ? `Found ${filteredCalculators.reduce((acc, cat) => acc + cat.items.length, 0)} calculator${
                    filteredCalculators.reduce((acc, cat) => acc + cat.items.length, 0) === 1 ? "" : "s"
                  }`
                : "No calculators found. Try another search."}
            </p>
          )}
        </div>

        {/* BASIC CALCULATOR */}
        {!searchQuery && (
          <div className="mb-12">
            <BasicCalculator />
          </div>
        )}

        {/* CALCULATOR CATEGORIES */}
        {hasResults ? (
          filteredCalculators.map((category) => (
            <section key={category.category} className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                {category.category}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((calc) => (
                  <Link key={calc.href} href={calc.href} className="group">
                    <article className="h-full bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col">
                      <div className="text-3xl mb-3">{calc.emoji}</div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {calc.title}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed flex-1">
                        {calc.description}
                      </p>

                      <span className="mt-3 inline-flex items-center gap-1 text-blue-600 font-medium text-sm">
                        Use Calculator
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          ))
        ) : searchQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Try searching for mortgage, BMI, GPA, discount, or tip</p>
          </div>
        ) : null}

        {/* TRUST SECTION */}
        <section className="my-16 max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-base">
                  Instant Results
                </h3>
                <p className="text-gray-600 text-sm">
                  Real-time calculations as you type.
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-base">
                  Accurate Formulas
                </h3>
                <p className="text-gray-600 text-sm">
                  Reliable algorithms with clear breakdowns.
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-base">
                  Privacy First
                </h3>
                <p className="text-gray-600 text-sm">
                  No tracking. No data storage. Ever.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="mt-16 max-w-4xl mx-auto space-y-8 text-gray-700 leading-relaxed text-[15px]">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Complete Calculator Suite for Daily Life
            </h2>
            <p className="mb-3">
              Access instant calculators designed to solve everyday mathematical, financial, health, and academic problems. Our mortgage calculator helps homebuyers understand monthly payments including taxes, insurance, and PMI with detailed amortization schedules. The loan EMI calculator handles home loans, car loans, and personal loans with precise interest breakdowns.
            </p>
            <p>
              Calculate your BMI to understand healthy weight ranges, use the calorie calculator to determine daily caloric needs with macro breakdowns for weight loss or muscle gain, and track academic performance with our GPA calculator supporting 10+ international grading systems including US, UK, Indian, and German standards.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Financial Planning Made Simple
            </h2>
            <p>
              Our mortgage calculator provides comprehensive home loan analysis with property tax estimates, homeowner's insurance, and private mortgage insurance (PMI) calculations. Compare 15-year versus 30-year mortgage terms to understand long-term cost differences. The loan EMI calculator uses standard amortization formulas recognized by financial institutions worldwide, showing you exactly how much principal and interest you pay each month. Use the discount calculator during shopping to calculate final prices across multiple items and maximize your savings during seasonal sales.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Health and Fitness Tracking
            </h2>
            <p>
              The BMI calculator follows World Health Organization standards to classify your weight status as underweight, normal weight, overweight, or obese based on height and weight measurements in both metric and imperial units. Our calorie calculator implements the scientifically validated Mifflin-St Jeor equation to calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE), providing customized macronutrient targets for protein, carbohydrates, and fats based on your specific fitness goals.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Academic Success Tools
            </h2>
            <p>
              Calculate your GPA accurately with support for multiple grading systems including the US 4.0 scale, Indian 10-point CGPA, UK degree classifications, German grading, and more. Track semester performance, calculate cumulative GPA across terms, and use the target GPA feature to determine required grades in remaining courses. The age calculator goes beyond simple date subtraction to provide exact age in years, months, and days with real-time countdown to your next birthday, zodiac signs (Western and Chinese), day of week born, and fascinating planetary age calculations for Mars, Venus, and Jupiter.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Dining and Social Calculations
            </h2>
            <p>
              Never struggle with restaurant math again. The tip calculator handles percentage-based tipping (15%, 18%, 20%, or custom amounts) with automatic bill splitting among multiple people. Our advanced bill splitter tracks individual orders, shared appetizers, proportional tax distribution, and flexible tip allocation to ensure everyone pays their fair share. Whether splitting equally or itemizing orders, calculate down to the last cent for group dining experiences.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Why Choose These Calculators
            </h2>
            <p>
              Every calculator features real-time computation as you type, eliminating page reloads and submit buttons. We never collect personal data, require email addresses, or impose usage limits. No advertisements, no tracking cookies, no signup walls. The clean interface loads instantly even on slow connections and works flawlessly across smartphones, tablets, and desktop computers. All calculations use industry-standard formulas verified against authoritative sources.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Global Accessibility
            </h2>
            <p>
              Designed for worldwide use with support for metric and imperial measurements. Health calculators accept kilograms or pounds for weight, centimeters or feet for height. Financial calculators work with any currency without requiring specific symbols. The mortgage calculator, loan EMI calculator, BMI calculator, calorie calculator, GPA calculator, age calculator, tip calculator, and discount calculator all provide accurate results regardless of your location or preferred measurement system.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Mobile-Optimized Experience
            </h2>
            <p>
              Built with a mobile-first approach recognizing that most users access calculators from smartphones. Large touch-friendly input fields, responsive layouts adapting to any screen size, and simplified interfaces ensure quick calculations on the go. Whether shopping in stores using the discount calculator, at restaurants with the tip calculator, reviewing mortgage options, or checking your BMI at the gym, get instant answers without zooming or horizontal scrolling.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Transparent and Educational
            </h2>
            <p>
              Unlike black-box calculators, our tools show step-by-step breakdowns of how results are computed. The mortgage calculator displays full amortization tables showing payment splits between principal and interest. The loan EMI calculator reveals the complete repayment schedule. The GPA calculator explains conversion logic between grading systems. This educational approach helps users understand the mathematics behind results, building trust and enabling informed decision-making for financial planning, health tracking, and academic success.
            </p>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="mt-20 text-center max-w-xl mx-auto pb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Find Your Calculator in Seconds
          </h2>
          <p className="text-base text-gray-600 mb-5">
            Start calculating now - no signup, no waiting.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-7 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            Browse All Calculators
          </button>
        </section>
      </div>
    </main>
  );
}