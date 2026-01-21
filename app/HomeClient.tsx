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
        const lastResult = display;
        setExpression(lastResult + val);
        setDisplay(lastResult + val);
        setIsResult(false);
      } else {
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
    <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
      <div className="w-full max-w-[340px] mx-auto bg-[#d1d5db] p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,0.5)]">
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

      <div className="w-full max-w-sm mx-auto md:mx-0">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">History</h4>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Your calculations will appear here</p>
          ) : (
            history.map((h, i) => (
              <div
                key={i}
                onClick={() => {
                  const result = h.split("=")[1].trim();
                  setDisplay(result);
                  setExpression(result);
                  setIsResult(true);
                }}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-400 font-mono">{h.split("=")[0]}</span>
                <div className="font-bold text-gray-800">{h.split("=")[1]}</div>
              </div>
            ))
          )}
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
  const totalCalculators = calculators.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* HERO */}
        <header className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Calculators That Actually Work
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Mortgage payments, loan EMI, BMI, GPA, discounts, calories, tips. Get instant answers without the BS.
          </p>
        </header>

        {/* SEARCH BAR */}
        <div className="mb-10 max-w-2xl mx-auto">
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
              placeholder="Search calculators... try 'mortgage' or 'BMI'"
              className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-500">
              {hasResults
                ? `Found ${filteredCalculators.reduce((acc, cat) => acc + cat.items.length, 0)} calculator${
                    filteredCalculators.reduce((acc, cat) => acc + cat.items.length, 0) === 1 ? "" : "s"
                  }`
                : "No results. Try 'mortgage', 'loan', 'BMI', 'GPA', or 'discount'"}
            </p>
          )}
        </div>

       {/* BASIC CALCULATOR TEASER */}
{!searchQuery && (
  <>
    <div className="mb-8 max-w-xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 text-center">
        <div className="text-4xl mb-3">🧮</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Need Quick Math?</h2>
        <p className="text-gray-600 mb-4 text-sm">Basic calculator for simple arithmetic</p>
        <button 
          onClick={() => {
            const calcSection = document.getElementById('basic-calc');
            calcSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Open Calculator
        </button>
      </div>
    </div>
    
    {/* SCROLL INDICATOR */}
    <div className="flex flex-col items-center mb-10 animate-bounce">
      <div className="text-center mb-2">
        <p className="text-sm font-semibold text-gray-700 mb-1">
          {totalCalculators} Specialized Calculators Below
        </p>
        <p className="text-xs text-gray-500">
          Mortgage • Loans • BMI • GPA • Discounts • More
        </p>
      </div>
      <svg 
        className="w-8 h-8 text-blue-600" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M19 14l-7 7m0 0l-7-7m7 7V3" 
        />
      </svg>
    </div>
  </>
)}
        {/* CALCULATOR CATEGORIES */}
        {hasResults ? (
          filteredCalculators.map((category) => (
            <section key={category.category} className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">
                {category.category}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((calc) => (
                  <Link key={calc.href} href={calc.href} className="group">
                    <article className="h-full bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col">
                      <div className="text-3xl mb-3">{calc.emoji}</div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {calc.title}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed flex-1">
                        {calc.description}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1 text-blue-600 font-medium text-sm">
                        Open Calculator
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
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 mb-3">Can't find what you're looking for?</p>
            <p className="text-sm text-gray-400">Try: mortgage, loan, BMI, GPA, discount, tip, calorie, age</p>
          </div>
        ) : null}

        {/* BASIC CALCULATOR - FULL VERSION AT BOTTOM */}
        {!searchQuery && (
          <div id="basic-calc" className="mb-12 scroll-mt-8 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Basic Calculator</h2>
              <p className="text-gray-600">For quick arithmetic when you need it</p>
            </div>
            <BasicCalculator />
          </div>
        )}

        {/* TRUST BADGES */}
        <section className="my-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 sm:p-10 border border-gray-200">
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">
                  Instant Results
                </h3>
                <p className="text-gray-600 text-sm">
                  Calculates as you type. No loading screens, no submit buttons.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">
                  Real Math
                </h3>
                <p className="text-gray-600 text-sm">
                  Industry-standard formulas. Shows you exactly how we got the answer.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">
                  Zero Tracking
                </h3>
                <p className="text-gray-600 text-sm">
                  Your data never leaves your device. No cookies, no analytics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="mt-16 max-w-4xl mx-auto space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Every Calculator You Need, One Place
            </h2>
            <p className="mb-4">
              We built {totalCalculators} calculators that solve real problems. The mortgage calculator breaks down your monthly payment including property taxes, insurance, and PMI with a full amortization schedule showing how much goes to principal versus interest each month. The loan EMI calculator handles home loans, car loans, and personal loans using the same formulas banks use.
            </p>
            <p>
              For health tracking, the BMI calculator tells you if you're underweight, normal, overweight, or obese based on WHO standards. The calorie calculator uses the Mifflin-St Jeor equation to figure out exactly how many calories you need, then breaks it down into protein, carbs, and fat based on whether you want to lose weight, gain muscle, or maintain.
            </p>
            <p className="mt-4">
              Students get a GPA calculator that works with 10+ grading systems - US 4.0 scale, Indian 10-point CGPA, UK degree classifications, German grading, you name it. Track your semester GPA, calculate cumulative GPA, and use the target feature to see what grades you need to hit your goal.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Home Loans and Mortgage Planning
            </h2>
            <p className="mb-4">
              Buying a house? The mortgage calculator doesn't just give you a number. It shows you the complete picture: principal and interest, property tax estimates, homeowner's insurance, PMI if you're putting down less than 20%, and HOA fees if applicable. Compare 15-year versus 30-year mortgages to see how much interest you'll actually pay over the life of the loan.
            </p>
            <p>
              The amortization schedule breaks down every single payment for the entire loan. You'll see exactly how much of your first payment goes to interest (usually most of it) and how that shifts over time until your final payment is almost all principal. This matters when you're thinking about refinancing or making extra payments.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Loan EMI for Cars and Personal Loans
            </h2>
            <p className="mb-4">
              The EMI calculator works for any type of loan. Enter your loan amount, interest rate, and tenure in years and months. Get your exact monthly payment plus total interest over the loan period. The visual breakdown shows what percentage goes to principal versus interest.
            </p>
            <p>
              Home loans typically run 7-9% interest for 15-30 years. Car loans are 8-12% for 3-7 years. Personal loans hit 10-24% for 1-5 years. Higher rates mean more of your money goes to interest instead of paying down what you actually borrowed. The calculator makes this obvious so you can compare offers from different banks.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              BMI and Body Weight Analysis
            </h2>
            <p className="mb-4">
              The BMI calculator follows WHO guidelines: underweight is under 18.5, normal is 18.5-24.9, overweight is 25-29.9, obese is 30+. Enter your height and weight in metric (cm, kg) or imperial (feet/inches, pounds). Get your exact BMI number plus what category you fall into.
            </p>
            <p>
              BMI isn't perfect - it doesn't account for muscle mass - but it's a quick screening tool doctors use worldwide. Athletes and bodybuilders will score high because muscle weighs more than fat. For everyone else, it's a decent starting point for understanding if you're at a healthy weight.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Calorie Counting and Macros
            </h2>
            <p className="mb-4">
              The calorie calculator figures out your BMR (Basal Metabolic Rate) - how many calories you burn just existing - using the Mifflin-St Jeor equation. Then it multiplies by your activity level to get TDEE (Total Daily Energy Expenditure). That's how many calories you need to maintain your current weight.
            </p>
            <p>
              Want to lose weight? Subtract 500 calories for about 1 pound per week. Want to gain muscle? Add 300-500 calories and lift heavy. The macro breakdown gives you grams of protein, carbs, and fat based on your goal. High protein (30-40%) for muscle building, balanced macros for general health, higher carbs if you're an endurance athlete.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              GPA Calculation Across Grading Systems
            </h2>
            <p className="mb-4">
              The GPA calculator handles US 4.0 scale (A=4.0, B=3.0, C=2.0, D=1.0, F=0), Indian 10-point CGPA, UK degree classifications (First Class, Upper Second 2:1, Lower Second 2:2, Third), German 1-5 scale where 1.0 is best, plus systems from Canada, Australia, Singapore, France, Netherlands, and China.
            </p>
            <p>
              Add unlimited semesters and courses. Each course gets a grade and credit hours. The calculator weighs everything properly - a 4-credit A counts more than a 1-credit A. Track your semester GPA, cumulative GPA across all terms, and use the target feature to calculate what grades you need in remaining courses to hit your goal GPA.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Age Calculator with Zodiac and Planetary Ages
            </h2>
            <p className="mb-4">
              Enter your birthdate and the age calculator gives you exact age in years, months, days, hours, minutes, and seconds with a live countdown that updates every second. Total days lived, total hours, total minutes - all calculated precisely accounting for leap years and varying month lengths.
            </p>
            <p>
              Get your Western zodiac sign (Aries through Pisces based on your birth month) and Chinese zodiac animal (Rat, Ox, Tiger, etc. based on your birth year adjusted for Chinese New Year). See what day of the week you were born. Calculate your age on other planets - you're way older on Mercury but barely a year old on Saturn because of how long their orbits take.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Restaurant Tips and Bill Splitting
            </h2>
            <p className="mb-4">
              The tip calculator handles any tip percentage - 15%, 18%, 20%, or custom. Split the bill evenly or calculate individual amounts. See total cost including tip, per-person amounts, and exactly what to pay.
            </p>
            <p>
              The bill splitter goes deeper. Track who ordered what, handle shared appetizers and drinks, distribute tax proportionally, and choose whether to split tip equally or by bill proportion. Everyone pays their fair share down to the cent. Select who paid and instantly see who owes them how much.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Discount Calculator for Smart Shopping
            </h2>
            <p className="mb-4">
              Add up to 10 products with their discount percentages and original prices. The discount calculator shows you the final price for each item, how much you save per item, total savings across everything, and your overall discount percentage. Perfect for comparing deals during Black Friday, holiday sales, or clearance events.
            </p>
            <p>
              The calculator updates in real time as you type. Add items, remove items, change percentages - everything recalculates instantly. Share your savings on social media or download a shareable card showing how much you saved. Because bragging about a good deal is half the fun.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why These Calculators Don't Suck
            </h2>
            <p className="mb-4">
              Every calculator calculates as you type. No submit buttons, no page reloads, no waiting. Type a number and boom - instant result. That's how it should work.
            </p>
            <p className="mb-4">
              We don't collect data. At all. No email signup, no cookies, no analytics tracking your every move, no selling your info to advertisers. The calculator runs entirely in your browser. Your numbers never hit our servers because we don't have servers to hit.
            </p>
            <p>
              No ads. No popups. No "subscribe to our newsletter" harassment. No "upgrade to premium for more features" upsells. Every calculator is 100% free with every feature unlocked. We built these because we needed them and got tired of sketchy calculator sites that are basically malware wrapped in a web page.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Works on Any Device
            </h2>
            <p className="mb-4">
              Pull out your phone at the car dealership to calculate that "amazing" loan offer. Use your tablet at the restaurant to split the bill. Open your laptop to plan your mortgage. Every calculator works perfectly on every screen size.
            </p>
            <p>
              Big touch-friendly buttons on mobile. Responsive layouts that don't make you pinch and zoom. Fast loading even on slow connections. Works offline once it loads. No app to download, no permissions to grant. Just open the site and use it.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Metric and Imperial, Any Currency
            </h2>
            <p className="mb-4">
              Health calculators accept kilograms or pounds, centimeters or feet and inches. Financial calculators work with dollars, rupees, euros, pounds - we don't care because we're just doing math. Enter numbers in whatever format makes sense to you.
            </p>
            <p>
              The mortgage calculator, loan EMI calculator, BMI calculator, calorie calculator, GPA calculator, age calculator, tip calculator, discount calculator, and bill splitter all adapt to how you want to use them. No forced unit conversions, no currency symbols that don't match your location.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How the Math Actually Works
            </h2>
            <p className="mb-4">
              We show our work. The mortgage calculator displays the full amortization table - every payment for 15 or 30 years showing principal, interest, and remaining balance. The loan EMI calculator breaks down the formula so you understand why your EMI is what it is. The GPA calculator explains how it converts between grading systems.
            </p>
            <p>
              This isn't a black box that spits out numbers. You can see exactly what's happening and verify it yourself. Check it against your bank's numbers, your doctor's BMI chart, your school's GPA system. The math is standard, verified, and transparent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              When You Need Answers Now
            </h2>
            <p>
              Mortgage calculator when you're house hunting and need to know if you can afford that price. Loan EMI calculator at the dealership when they're pushing a car payment. BMI calculator after a doctor's visit. Calorie calculator starting a new diet. GPA calculator before course registration. Age calculator for forms and applications. Tip calculator after dinner. Discount calculator while shopping. Bill splitter with friends.
            </p>
            <p className="mt-4">
              We made {totalCalculators} calculators that solve real problems in real situations. No signup required. No premium tier. No bullshit. Just working calculators that give you the right answer fast.
            </p>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="mt-20 text-center max-w-xl mx-auto pb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Find What You Need
          </h2>
          <p className="text-base text-gray-600 mb-6">
            {totalCalculators} calculators ready to use. No waiting, no signup, no catch.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg hover:shadow-xl"
>
Browse All Calculators
</button>
</section>
</div>
</main>
);
}
