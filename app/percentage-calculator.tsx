"use client";

import { useState } from "react";

type CalculationType = "percentage-of" | "is-what-percent" | "percent-change" | "increase-decrease";

export default function PercentageCalculator() {
  const [calcType, setCalcType] = useState<CalculationType>("percentage-of");
  
  // What is X% of Y?
  const [percent1, setPercent1] = useState("");
  const [number1, setNumber1] = useState("");
  
  // X is what % of Y?
  const [numberA, setNumberA] = useState("");
  const [numberB, setNumberB] = useState("");
  
  // Percent change from X to Y
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");
  
  // Increase/Decrease number by %
  const [baseNumber, setBaseNumber] = useState("");
  const [changePercent, setChangePercent] = useState("");
  const [operation, setOperation] = useState<"increase" | "decrease">("increase");

  function shareResults(result: string) {
    const text = `My calculation result: ${result}\n\nUse this free percentage calculator!`;
    
if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        navigator.share({ title: "My Percentage Calculation", text: text })
        .catch((error) => {
          // User cancelled the share - do nothing
          if (error.name !== 'AbortError') {
            // Only show error if it's not a cancellation
            console.error('Share failed:', error);
          }
        });
    } else {
      navigator.clipboard.writeText(text);
      alert("📋 Copied to clipboard!");
    }
  }

  // Calculations
  let result = "";
  let steps: string[] = [];
  let hasResult = false;

  if (calcType === "percentage-of") {
    const p = Number(percent1);
    const n = Number(number1);
    if (percent1 && number1 && !isNaN(p) && !isNaN(n)) {
      const answer = (p / 100) * n;
      result = answer.toFixed(2);
      steps = [
        `Convert ${p}% to decimal: ${p} ÷ 100 = ${(p/100).toFixed(4)}`,
        `Multiply: ${(p/100).toFixed(4)} × ${n} = ${result}`
      ];
      hasResult = true;
    }
  } else if (calcType === "is-what-percent") {
    const a = Number(numberA);
    const b = Number(numberB);
if (numberA.trim() && numberB.trim() && !isNaN(a) && !isNaN(b)) {
  if (b === 0) {
    result = "Cannot divide by zero";
    steps = ["The second number cannot be 0 because division by zero is undefined."];
    hasResult = true;
  } else {      const answer = (a / b) * 100;
      result = answer.toFixed(2) + "%";
      steps = [
        `Divide: ${a} ÷ ${b} = ${(a/b).toFixed(4)}`,
        `Multiply by 100: ${(a/b).toFixed(4)} × 100 = ${answer.toFixed(2)}%`
      ];
      hasResult = true;
    }}
  } else if (calcType === "percent-change") {
    const oldVal = Number(oldValue);
    const newVal = Number(newValue);
if (oldValue.trim() && newValue.trim() && !isNaN(oldVal) && !isNaN(newVal)) {
  if (oldVal === 0) {
    result = "Cannot divide by zero";
    steps = ["Original value cannot be 0 for percentage change."];
    hasResult = true;
  } else {      const change = ((newVal - oldVal) / oldVal) * 100;
const changeType = change >= 0 ? "increase" : "decrease";
const absChange = Math.abs(change);
      result = (change >= 0 ? "+" : "") + change.toFixed(2) + "%";
      steps = [
        `Subtract: ${newVal} - ${oldVal} = ${(newVal - oldVal).toFixed(2)}`,
        `Divide by original: ${(newVal - oldVal).toFixed(2)} ÷ ${oldVal} = ${((newVal - oldVal) / oldVal).toFixed(4)}`,
        `Multiply by 100: ${((newVal - oldVal) / oldVal).toFixed(4)} × 100 = ${change.toFixed(2)}%`,
`This is a ${absChange.toFixed(2)}% ${changeType}`      ];
      hasResult = true;
    }}
  } else if (calcType === "increase-decrease") {
    const base = Number(baseNumber);
    const pct = Number(changePercent);
    if (baseNumber && changePercent && !isNaN(base) && !isNaN(pct)) {
      const changeAmount = (pct / 100) * base;
      const finalValue = operation === "increase" ? base + changeAmount : base - changeAmount;
      result = finalValue.toFixed(2);
      steps = [
        `Calculate ${pct}% of ${base}: (${pct} ÷ 100) × ${base} = ${changeAmount.toFixed(2)}`,
        `${operation === "increase" ? "Add" : "Subtract"}: ${base} ${operation === "increase" ? "+" : "-"} ${changeAmount.toFixed(2)} = ${result}`
      ];
      hasResult = true;
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Percentage Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Calculate percentages easily • Four calculation modes
          </p>
        </header>

        {/* Calculator Type Tabs */}
        <div className="mb-6 overflow-x-auto pb-2">
<div role="tablist" className="flex gap-2 min-w-max">            <button
              onClick={() => setCalcType("percentage-of")}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                calcType === "percentage-of"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-300"
              }`}
            >
              % of Number
            </button>
            <button
              onClick={() => setCalcType("is-what-percent")}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                calcType === "is-what-percent"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-300"
              }`}
            >
              Is What %
            </button>
            <button
              onClick={() => setCalcType("percent-change")}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                calcType === "percent-change"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-300"
              }`}
            >
              % Change
            </button>
            <button
              onClick={() => setCalcType("increase-decrease")}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                calcType === "increase-decrease"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-300"
              }`}
            >
              Increase/Decrease
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-4 sm:gap-6 items-start">
          {/* LEFT: Calculator */}
          <section>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200">
              {calcType === "percentage-of" && (
                <>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">What is X% of Y?</h2>
                  <p className="text-sm text-gray-600 mb-4">Calculate a percentage of any number</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Percentage
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="e.g., 15"
                          value={percent1}
                          onChange={(e) => setPercent1(e.target.value)}
                          className="w-full px-4 py-3 pr-10 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold pointer-events-none">
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Of Number
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 200"
                        value={number1}
                        onChange={(e) => setNumber1(e.target.value)}
                        className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-gray-700">
                      <strong>Example:</strong> What is 15% of 200? = <strong>30</strong>
                    </div>
                  </div>
                </>
              )}

              {calcType === "is-what-percent" && (
                <>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">X is what % of Y?</h2>
                  <p className="text-sm text-gray-600 mb-4">Find what percentage one number is of another</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Number (X)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 50"
                        value={numberA}
                        onChange={(e) => setNumberA(e.target.value)}
                        className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Of Number (Y)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 200"
                        value={numberB}
                        onChange={(e) => setNumberB(e.target.value)}
                        className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-gray-700">
                      <strong>Example:</strong> 50 is what % of 200? = <strong>25%</strong>
                    </div>
                  </div>
                </>
              )}

              {calcType === "percent-change" && (
                <>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Percentage Change</h2>
                  <p className="text-sm text-gray-600 mb-4">Calculate increase or decrease between two values</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Original Value
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 100"
                        value={oldValue}
                        onChange={(e) => setOldValue(e.target.value)}
                        className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Value
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 150"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-gray-700">
                      <strong>Example:</strong> From 100 to 150 = <strong>+50% increase</strong>
                    </div>
                  </div>
                </>
              )}

              {calcType === "increase-decrease" && (
                <>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Increase/Decrease by %</h2>
                  <p className="text-sm text-gray-600 mb-4">Add or subtract a percentage from a number</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Starting Number
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 100"
                        value={baseNumber}
                        onChange={(e) => setBaseNumber(e.target.value)}
                        className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Percentage
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="e.g., 20"
                          value={changePercent}
                          onChange={(e) => setChangePercent(e.target.value)}
                          className="w-full px-4 py-3 pr-10 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold pointer-events-none">
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Operation
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setOperation("increase")}
                          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                            operation === "increase"
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          Increase
                        </button>
                        <button
                          onClick={() => setOperation("decrease")}
                          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                            operation === "decrease"
                              ? "bg-red-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          Decrease
                        </button>
                      </div>
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-gray-700">
                      <strong>Example:</strong> 100 increased by 20% = <strong>120</strong>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* RIGHT: Result */}
          <aside className="lg:sticky lg:top-6">
            {hasResult ? (
              <>
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Result
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-4">
                    {result}
                  </div>
                  
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-3 rounded mb-3">
                    <div className="text-xs font-semibold text-gray-600 mb-2">Step by Step</div>
                    <div className="space-y-1">
                      {steps.map((step, i) => (
                        <div key={i} className="text-xs text-gray-700">
                          {i + 1}. {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Share Button */}
                <button
                  onClick={() => shareResults(result)}
                  className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  Share Result
                </button>
              </>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300 text-center">
                <div className="text-4xl mb-2">🔢</div>
                <div className="text-gray-600 text-sm font-medium">
                  Enter values to see your result
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* SEO Content */}
        <div className="mt-12 space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Calculate Percentage: Complete Guide
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Learning how to calculate percentage is essential for everyday life. Whether you're calculating discounts while shopping, 
              figuring out test scores, or analyzing business data, our free percentage calculator makes it easy. Simply choose your 
              calculation type, enter the numbers, and get instant results with detailed step-by-step solutions.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              A percentage calculator is a tool that performs percentage calculations automatically. Instead of doing manual math, 
              you can use this online percentage calculator to find percentages of numbers, calculate percentage increase or decrease, 
              determine what percent one number is of another, and solve other percentage problems in seconds.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This calculator is perfect for students learning percentages, shoppers calculating sale prices, business professionals 
              tracking growth metrics, teachers grading assignments, and anyone who needs quick, accurate percentage calculations 
              without complex formulas or mental math.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              What is a Percentage?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              A percentage is a number or ratio expressed as a fraction of 100. The word "percent" comes from the Latin "per centum" 
              meaning "by the hundred." The symbol % is used to denote percentage. For example, 25% means 25 out of 100, or 25/100, 
              or 0.25 as a decimal.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Percentages are used everywhere in daily life: sales discounts (20% off), test scores (scored 85%), interest rates 
              (5% APR), statistics (60% approval rating), nutrition labels (10% daily value), and much more. Understanding how to 
              work with percentages is a fundamental math skill.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Calculate Percentage: Four Common Methods
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">1. How to Find What Percentage of a Number (X% of Y)</h3>
                <p className="text-gray-700 mb-2">To calculate what is X% of Y, convert the percentage to a decimal by dividing by 100, then multiply by the number.</p>
                <p className="text-gray-700 mb-2"><strong>Formula:</strong> (X ÷ 100) × Y = Result</p>
                <p className="text-gray-700"><strong>Example:</strong> What is 20% of 150? (20 ÷ 100) × 150 = 0.20 × 150 = 30</p>
                <p className="text-gray-700 mt-2 text-sm">Common uses: Calculating discounts, finding tips, determining tax amounts, calculating commissions</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">2. How to Calculate What Percent One Number is of Another (X is what % of Y)</h3>
                <p className="text-gray-700 mb-2">To find what percentage X is of Y, divide X by Y, then multiply by 100 to convert to a percentage.</p>
                <p className="text-gray-700 mb-2"><strong>Formula:</strong> (X ÷ Y) × 100 = Percentage</p>
                <p className="text-gray-700"><strong>Example:</strong> 45 is what % of 180? (45 ÷ 180) × 100 = 0.25 × 100 = 25%</p>
                <p className="text-gray-700 mt-2 text-sm">Common uses: Test scores, survey results, completion rates, comparing values, market share</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">3. How to Calculate Percentage Increase or Decrease (Percentage Change)</h3>
                <p className="text-gray-700 mb-2">To calculate percentage change, subtract the old value from the new value, divide by the old value, then multiply by 100.</p>
                <p className="text-gray-700 mb-2"><strong>Formula:</strong> ((New Value - Old Value) ÷ Old Value) × 100 = % Change</p>
                <p className="text-gray-700"><strong>Example:</strong> From 80 to 100? ((100 - 80) ÷ 80) × 100 = (20 ÷ 80) × 100 = 25% increase</p>
                <p className="text-gray-700 mt-2 text-sm">Common uses: Stock price changes, population growth, sales trends, price inflation, weight loss tracking</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">4. How to Increase or Decrease a Number by a Percentage</h3>
                <p className="text-gray-700 mb-2">To increase or decrease a number by a percentage, calculate the percentage amount, then add (for increase) or subtract (for decrease) from the original number.</p>
                <p className="text-gray-700 mb-2"><strong>Formula:</strong> Number ± (Number × Percentage ÷ 100) = Result</p>
                <p className="text-gray-700"><strong>Example:</strong> 200 increased by 15%? 200 + (200 × 15 ÷ 100) = 200 + 30 = 230</p>
                <p className="text-gray-700 mt-2 text-sm">Common uses: Price increases, salary raises, applying discounts, calculating final sale prices, interest calculations</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Percentage Calculation Examples: Real-World Scenarios
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Shopping Discount Example</h3>
                <p className="text-gray-700 mb-1"><strong>Problem:</strong> A jacket costs $80 and is on sale for 25% off. What is the sale price?</p>
                <p className="text-gray-700 mb-1"><strong>Solution:</strong> Calculate 25% of 80 = (25 ÷ 100) × 80 = $20 discount</p>
                <p className="text-gray-700"><strong>Answer:</strong> Sale price = $80 - $20 = $60</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Test Score Example</h3>
                <p className="text-gray-700 mb-1"><strong>Problem:</strong> You got 42 questions correct out of 50. What is your percentage score?</p>
                <p className="text-gray-700 mb-1"><strong>Solution:</strong> (42 ÷ 50) × 100 = 0.84 × 100</p>
                <p className="text-gray-700"><strong>Answer:</strong> Your score is 84%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Restaurant Tip Example</h3>
                <p className="text-gray-700 mb-1"><strong>Problem:</strong> Your restaurant bill is $45. You want to leave a 18% tip. How much is the tip?</p>
                <p className="text-gray-700 mb-1"><strong>Solution:</strong> (18 ÷ 100) × 45 = 0.18 × 45</p>
                <p className="text-gray-700"><strong>Answer:</strong> Tip = $8.10, Total bill = $53.10</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Salary Increase Example</h3>
                <p className="text-gray-700 mb-1"><strong>Problem:</strong> You earn $50,000 per year and get a 5% raise. What is your new salary?</p>
                <p className="text-gray-700 mb-1"><strong>Solution:</strong> $50,000 + ($50,000 × 5 ÷ 100) = $50,000 + $2,500</p>
                <p className="text-gray-700"><strong>Answer:</strong> New salary = $52,500</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Investment Growth Example</h3>
                <p className="text-gray-700 mb-1"><strong>Problem:</strong> Your investment grew from $1,000 to $1,250. What is the percentage gain?</p>
                <p className="text-gray-700 mb-1"><strong>Solution:</strong> ((1250 - 1000) ÷ 1000) × 100 = (250 ÷ 1000) × 100</p>
                <p className="text-gray-700"><strong>Answer:</strong> 25% gain</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              When to Use a Percentage Calculator
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Shopping & Retail</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Calculate sale discounts and final prices</li>
                  <li>• Compare prices across different stores</li>
                  <li>• Determine savings from coupons</li>
                  <li>• Calculate sales tax amounts</li>
                  <li>• Figure out cashback percentages</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Education & Testing</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Convert test scores to percentages</li>
                  <li>• Calculate grade point averages</li>
                  <li>• Determine passing scores</li>
                  <li>• Analyze exam performance</li>
                  <li>• Compare student rankings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Business & Finance</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Calculate profit margins and markups</li>
                  <li>• Track sales growth percentages</li>
                  <li>• Determine interest rates on loans</li>
                  <li>• Calculate commission amounts</li>
                  <li>• Analyze revenue changes over time</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Personal Finance</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Calculate tip amounts at restaurants</li>
                  <li>• Determine budget allocations</li>
                  <li>• Track savings rates and goals</li>
                  <li>• Calculate loan interest payments</li>
                  <li>• Analyze investment returns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Health & Fitness</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Calculate weight loss percentages</li>
                  <li>• Determine body fat percentage changes</li>
                  <li>• Track workout improvement rates</li>
                  <li>• Calculate calorie reductions</li>
                  <li>• Monitor progress toward goals</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Data & Statistics</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Calculate survey response rates</li>
                  <li>• Determine statistical percentages</li>
                  <li>• Analyze demographic data</li>
                  <li>• Calculate error margins</li>
                  <li>• Compare data sets and trends</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Percentage Calculator Tips and Tricks
            </h2>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Quick Mental Math for Common Percentages</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• <strong>10%:</strong> Move decimal point one place left (10% of 250 = 25)</li>
                  <li>• <strong>1%:</strong> Move decimal point two places left (1% of 250 = 2.5)</li>
                  <li>• <strong>5%:</strong> Find 10% and divide by 2 (5% of 250 = 12.5)</li>
                  <li>• <strong>25%:</strong> Divide by 4 (25% of 100 = 25)</li>
                  <li>• <strong>50%:</strong> Divide by 2 (50% of 100 = 50)</li>
                  <li>• <strong>75%:</strong> Find 50% and add 25% (75% of 100 = 75)</li>
                </ul>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Common Percentage Mistakes to Avoid</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Don't confuse percentage point change with percentage change</li>
                  <li>• Remember: 50% increase then 50% decrease ≠ original value</li>
                  <li>• Always check if you need to add or subtract the result</li>
                  <li>• Use parentheses correctly in complex calculations</li>
                  <li>• Double-check which number is the "whole" (denominator)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Percentage Formulas
            </h2>
            <div className="space-y-3">
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-1">Finding X% of Y:</p>
                <p className="text-gray-800 font-mono text-sm">(X ÷ 100) × Y = Result</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-1">X is what % of Y:</p>
                <p className="text-gray-800 font-mono text-sm">(X ÷ Y) × 100 = Percentage</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-1">Percentage Change:</p>
                <p className="text-gray-800 font-mono text-sm">((New - Old) ÷ Old) × 100 = % Change</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-1">Increase/Decrease Number by X%:</p>
                <p className="text-gray-800 font-mono text-sm">Number ± (Number × X ÷ 100) = Result</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions About Percentages
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do you calculate percentage?</h3>
                <p className="text-gray-700">To calculate a percentage, divide the part by the whole and multiply by 100. For example, to find what percentage 25 is of 100: (25 ÷ 100) × 100 = 25%. You can also use our free percentage calculator above to get instant results without doing manual calculations.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do I calculate percentage of a total?</h3>
                <p className="text-gray-700">To calculate what percentage one number represents of a total, divide that number by the total and multiply by 100. For example, if you scored 45 out of 60 points: (45 ÷ 60) × 100 = 75%. This means you got 75% of the total points.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How to find percentage increase?</h3>
                <p className="text-gray-700">To calculate percentage increase, subtract the original value from the new value, divide by the original value, and multiply by 100. Formula: ((New - Old) ÷ Old) × 100. Example: If a price went from $50 to $75: ((75 - 50) ÷ 50) × 100 = 50% increase.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How to calculate percentage decrease?</h3>
                <p className="text-gray-700">Percentage decrease uses the same formula as percentage increase. Subtract the new value from the old value, divide by the old value, and multiply by 100. Example: From $100 to $80: ((80 - 100) ÷ 100) × 100 = -20% (a 20% decrease).</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What is the easiest way to calculate percentages?</h3>
                <p className="text-gray-700">The easiest way is to use a percentage calculator like this one. Simply enter your numbers and get instant accurate results. For mental math, remember that 10% is one-tenth (divide by 10), 50% is half (divide by 2), and 25% is one-quarter (divide by 4).</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do you calculate discount percentage?</h3>
                <p className="text-gray-700">To find the discount percentage, subtract the sale price from the original price, divide by the original price, and multiply by 100. Example: Original price $200, sale price $150: ((200 - 150) ÷ 200) × 100 = 25% discount.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How to calculate percentage of marks?</h3>
                <p className="text-gray-700">Divide your total marks obtained by the maximum marks and multiply by 100. Formula: (Marks Obtained ÷ Total Marks) × 100. Example: You scored 380 out of 500: (380 ÷ 500) × 100 = 76%.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What's the difference between percentage and percent?</h3>
                <p className="text-gray-700">"Percent" and "percentage" are often used interchangeably, but technically "percent" is used with a number (25 percent), while "percentage" refers to the concept or amount (a large percentage). In practice, both terms mean the same thing: a ratio or fraction expressed out of 100.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can you calculate percentage without a calculator?</h3>
                <p className="text-gray-700">Yes! For simple percentages: 10% = divide by 10, 50% = divide by 2, 25% = divide by 4, 1% = divide by 100. For others, convert the percentage to a decimal (20% = 0.20) and multiply. However, using a percentage calculator is faster and more accurate for complex calculations.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How accurate is this percentage calculator?</h3>
                <p className="text-gray-700">Our percentage calculator is accurate to 2 decimal places, which is precise enough for all everyday calculations including financial calculations, academic grading, business analytics, and scientific measurements. The calculator uses standard mathematical formulas and provides step-by-step breakdowns.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Is this percentage calculator free to use?</h3>
                <p className="text-gray-700">Yes! This percentage calculator is completely free with no limitations. You don't need to register, download anything, or pay any fees. Use it as many times as you need for all your percentage calculations.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can I use this calculator on mobile?</h3>
                <p className="text-gray-700">Absolutely! This percentage calculator is fully responsive and works perfectly on all devices - smartphones, tablets, laptops, and desktop computers. The interface automatically adjusts to your screen size for the best experience.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What if I need to calculate percentages for multiple values?</h3>
                <p className="text-gray-700">Simply use the calculator multiple times for different values. Each calculation is independent, so you can solve as many percentage problems as you need. For bulk calculations or spreadsheet work, you might want to use Excel or Google Sheets formulas.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do you convert a fraction to a percentage?</h3>
                <p className="text-gray-700">Divide the numerator by the denominator and multiply by 100. For example, to convert 3/4 to a percentage: (3 ÷ 4) × 100 = 75%. You can also use the "X is what % of Y" calculator by entering the numerator as X and denominator as Y.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do you convert a decimal to a percentage?</h3>
                <p className="text-gray-700">Multiply the decimal by 100. For example, 0.85 as a percentage is 0.85 × 100 = 85%. To convert back from percentage to decimal, divide by 100 (85% = 85 ÷ 100 = 0.85).</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}