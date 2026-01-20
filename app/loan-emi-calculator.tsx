"use client";

import { useState } from "react";

type LoanType = "general" | "home" | "car";

export default function LoanEMICalculator() {
  const [loanType, setLoanType] = useState<LoanType>("general");
  
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureYears, setTenureYears] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  
  const [propertyValue, setPropertyValue] = useState("");
  const [downPayment, setDownPayment] = useState("");
  
  const [carPrice, setCarPrice] = useState("");
  const [carDownPayment, setCarDownPayment] = useState("");
  
  const [showAmortization, setShowAmortization] = useState(false);

  function shareResults(emi: number) {
    const text = `My Loan EMI: ${emi.toFixed(0)} per month\n\nCalculate your EMI now!`;
    
    if (navigator.share) {
      navigator.share({ title: "My EMI Calculation", text })
        .catch((error) => {
          if (error.name !== 'AbortError') console.error('Share failed:', error);
        });
    } else {
      navigator.clipboard.writeText(text);
      alert("📋 Copied!");
    }
  }

  let principal = 0;
  let rate = Number(interestRate);
  let tenure = (Number(tenureYears) * 12) + Number(tenureMonths);

  if (loanType === "home" && propertyValue && downPayment) {
    principal = Number(propertyValue) - Number(downPayment);
  } else if (loanType === "car" && carPrice && carDownPayment) {
    principal = Number(carPrice) - Number(carDownPayment);
  } else if (loanAmount) {
    principal = Number(loanAmount);
  }

  let emi = 0;
  let totalInterest = 0;
  let totalPayment = 0;
  let hasResult = false;

  if (principal > 0 && rate > 0 && tenure > 0) {
    const monthlyRate = rate / 12 / 100;
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    totalPayment = emi * tenure;
    totalInterest = totalPayment - principal;
    hasResult = true;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <header className="mb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            Loan EMI Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Calculate monthly EMI for home, car, personal loans • Compare options easily
          </p>
        </header>

        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "general", label: "General Loan" },
              { id: "home", label: "Home Loan" },
              { id: "car", label: "Car Loan" }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setLoanType(type.id as LoanType)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  loanType === type.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-300"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-4 sm:gap-6 items-start">
          <section>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border">
              {loanType === "general" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">General Loan Calculator</h2>
                  <p className="text-sm text-gray-600 mb-4">Calculate EMI for personal loans, education loans, or any loan type</p>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Amount</label>
                    <input type="number" placeholder="100000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Interest Rate (% per annum)</label>
                    <div className="relative">
                      <input type="number" step="0.1" placeholder="10.5" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-4 py-3 pr-10 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold pointer-events-none">%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tenure (Years)</label>
                      <input type="number" placeholder="5" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Months</label>
                      <input type="number" min="0" max="11" placeholder="0" value={tenureMonths} onChange={(e) => setTenureMonths(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                    </div>
                  </div>
                </div>
              )}

              {loanType === "home" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Home Loan EMI Calculator</h2>
                  <p className="text-sm text-gray-600 mb-4">Calculate monthly EMI for your home loan or mortgage</p>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Property Value</label>
                    <input type="number" placeholder="5000000" value={propertyValue} onChange={(e) => setPropertyValue(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Down Payment</label>
                    <input type="number" placeholder="1000000" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-gray-700">
                    <strong>Loan Amount:</strong> {propertyValue && downPayment ? (Number(propertyValue) - Number(downPayment)).toLocaleString() : '0'}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Interest Rate (% per annum)</label>
                    <div className="relative">
                      <input type="number" step="0.1" placeholder="8.5" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-4 py-3 pr-10 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold pointer-events-none">%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tenure (Years)</label>
                      <input type="number" placeholder="20" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Months</label>
                      <input type="number" min="0" max="11" placeholder="0" value={tenureMonths} onChange={(e) => setTenureMonths(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                    </div>
                  </div>
                </div>
              )}

              {loanType === "car" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Car Loan EMI Calculator</h2>
                  <p className="text-sm text-gray-600 mb-4">Calculate monthly EMI for your vehicle loan</p>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Car Price (On-Road)</label>
                    <input type="number" placeholder="800000" value={carPrice} onChange={(e) => setCarPrice(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Down Payment</label>
                    <input type="number" placeholder="200000" value={carDownPayment} onChange={(e) => setCarDownPayment(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-gray-700">
                    <strong>Loan Amount:</strong> {carPrice && carDownPayment ? (Number(carPrice) - Number(carDownPayment)).toLocaleString() : '0'}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Interest Rate (% per annum)</label>
                    <div className="relative">
                      <input type="number" step="0.1" placeholder="9.5" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-4 py-3 pr-10 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold pointer-events-none">%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tenure (Years)</label>
                      <input type="number" placeholder="5" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Months</label>
                      <input type="number" min="0" max="11" placeholder="0" value={tenureMonths} onChange={(e) => setTenureMonths(e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="lg:sticky lg:top-6">
            {hasResult ? (
              <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-200">
                <div className="text-center pb-4 mb-4 border-b border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Monthly EMI</div>
                  <div className="text-5xl font-bold text-indigo-600">{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Principal Amount</span><span className="text-lg font-bold text-gray-900">{principal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Total Interest</span><span className="text-lg font-bold text-orange-600">{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200"><span className="text-sm font-semibold text-gray-700">Total Payment</span><span className="text-xl font-bold text-gray-900">{totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
                </div>
                
                {/* Visual Breakdown */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-600 mb-2">Payment Breakdown</div>
                  <div className="flex h-8 rounded-lg overflow-hidden">
                    <div className="bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold" style={{ width: `${(principal / totalPayment) * 100}%` }}>
                      {((principal / totalPayment) * 100).toFixed(0)}%
                    </div>
                    <div className="bg-orange-500 flex items-center justify-center text-white text-xs font-semibold" style={{ width: `${(totalInterest / totalPayment) * 100}%` }}>
                      {((totalInterest / totalPayment) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Principal</span>
                    <span>Interest</span>
                  </div>
                </div>

                <button onClick={() => shareResults(emi)} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <span>📤</span>
                  Share Result
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300 text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-gray-600 text-sm font-medium">Enter loan details to calculate EMI</div>
              </div>
            )}
          </aside>
        </div>

    


    {/* SEO Content Below Calculator */}
<div className="mt-12 space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
  <section>
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
      How to Use This EMI Calculator
    </h2>
    <p className="text-gray-700 leading-relaxed mb-3">
      Our EMI calculator helps you calculate monthly installments for any type of loan - home loans, car loans, 
      personal loans, education loans, or business loans. Simply select your loan type, enter the loan amount 
      (or property/car price with down payment), interest rate, and tenure in years and months. The calculator 
      instantly shows your monthly EMI, total interest payable, and overall loan cost.
    </p>
    <p className="text-gray-700 leading-relaxed">
      Perfect for comparing loan offers from different banks, determining affordability before applying, planning 
      your monthly budget, or understanding the true cost of borrowing. The calculator provides a visual breakdown 
      showing what percentage of your total payment goes toward principal versus interest.
    </p>
  </section>



          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why Use Our EMI Calculator?
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Accurate Calculations:</strong> Uses the standard EMI formula to provide precise monthly payment amounts matching what banks calculate.</p>
              <p><strong>Multiple Loan Types:</strong> Dedicated calculators for home loans, car loans, and general personal loans with relevant fields for each.</p>
              <p><strong>Total Cost Visibility:</strong> See not just your EMI but also total interest payable and overall loan cost over the entire tenure.</p>
              <p><strong>Visual Breakdown:</strong> Interactive chart showing the proportion of principal versus interest in your total payment.</p>
              <p><strong>Flexible Tenure:</strong> Enter loan tenure in both years and months for precise calculation matching actual loan terms.</p>
              <p><strong>Compare Options:</strong> Quickly test different scenarios - higher down payment, longer tenure, or lower interest rates to find the best option.</p>
              <p><strong>Budget Planning:</strong> Determine if the monthly EMI fits your budget before committing to a loan.</p>
              <p><strong>Free & Private:</strong> No registration required, all calculations happen in your browser, no data stored or shared.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Key Features
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Calculate EMI for home, car, and personal loans</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Automatic loan amount calculation from property/car price</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Support for decimal interest rates (e.g., 8.5%, 10.25%)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Flexible tenure input in years and months</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Total interest and payment breakdown</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Visual principal vs interest chart</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Real-time calculation as you type</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Share results via text or social media</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Indian number format with commas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Mobile-friendly responsive design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Works offline once loaded</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>100% free, no ads, no registration</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Understanding the EMI Formula
            </h2>
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded mb-3">
              <p className="text-gray-800 font-semibold mb-2">EMI Calculation Formula:</p>
              <p className="text-gray-800 font-mono text-sm mb-3">
                EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
              </p>
              <div className="text-gray-800 text-sm space-y-1">
                <p><strong>P</strong> = Principal loan amount</p>
                <p><strong>R</strong> = Monthly interest rate (Annual rate ÷ 12 ÷ 100)</p>
                <p><strong>N</strong> = Total number of monthly installments (tenure in months)</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Example Calculation:</strong> For a loan of ₹10,00,000 at 10% annual interest for 5 years:
            </p>
            <div className="text-gray-700 text-sm space-y-1 ml-4">
              <p>• Monthly interest rate (R) = 10 ÷ 12 ÷ 100 = 0.00833</p>
              <p>• Number of months (N) = 5 × 12 = 60</p>
              <p>• EMI = [10,00,000 × 0.00833 × (1.00833)^60] / [(1.00833)^60 - 1]</p>
              <p>• <strong>Monthly EMI = ₹21,247</strong></p>
              <p>• Total amount payable = ₹21,247 × 60 = ₹12,74,820</p>
              <p>• Total interest = ₹12,74,820 - ₹10,00,000 = ₹2,74,820</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Types of Loans and Interest Rates
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <div className="border-l-4 border-indigo-500 pl-4 py-2">
                <h3 className="font-bold text-gray-900 mb-1">Home Loan / Housing Loan</h3>
                <p className="text-sm mb-2">Loans for purchasing property, construction, or home renovation. Home loans offer the lowest interest rates among all loan types.</p>
                <p className="text-sm"><strong>Interest Rate:</strong> 7.5% - 9.5% per annum</p>
                <p className="text-sm"><strong>Typical Tenure:</strong> 15-30 years (180-360 months)</p>
                <p className="text-sm"><strong>Loan Amount:</strong> Up to 90% of property value (10-20% down payment required)</p>
                <p className="text-sm"><strong>Tax Benefits:</strong> Deduction up to ₹2 lakhs on interest (Section 24) and ₹1.5 lakhs on principal (Section 80C)</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="font-bold text-gray-900 mb-1">Car Loan / Vehicle Loan</h3>
                <p className="text-sm mb-2">Loans for purchasing new or used cars, motorcycles, or commercial vehicles.</p>
                <p className="text-sm"><strong>Interest Rate:</strong> 8.5% - 12% per annum</p>
                <p className="text-sm"><strong>Typical Tenure:</strong> 3-7 years (36-84 months)</p>
                <p className="text-sm"><strong>Loan Amount:</strong> Up to 90% of on-road vehicle price (10-30% down payment typical)</p>
                <p className="text-sm"><strong>Note:</strong> Interest rates vary based on vehicle type, new vs used, and your credit score</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-bold text-gray-900 mb-1">Personal Loan</h3>
                <p className="text-sm mb-2">Unsecured loans for medical emergencies, weddings, education, debt consolidation, or any personal need.</p>
                <p className="text-sm"><strong>Interest Rate:</strong> 10.5% - 24% per annum</p>
                <p className="text-sm"><strong>Typical Tenure:</strong> 1-5 years (12-60 months)</p>
                <p className="text-sm"><strong>Loan Amount:</strong> ₹50,000 to ₹40 lakhs (based on income and credit score)</p>
                <p className="text-sm"><strong>Processing:</strong> Quick approval, minimal documentation, no collateral required</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h3 className="font-bold text-gray-900 mb-1">Education Loan</h3>
                <p className="text-sm mb-2">Loans for higher education in India or abroad, covering tuition, accommodation, and living expenses.</p>
                <p className="text-sm"><strong>Interest Rate:</strong> 8% - 15% per annum</p>
                <p className="text-sm"><strong>Typical Tenure:</strong> 5-15 years (repayment after course completion + moratorium period)</p>
                <p className="text-sm"><strong>Loan Amount:</strong> Up to ₹1.5 crores for study abroad</p>
                <p className="text-sm"><strong>Tax Benefits:</strong> Interest deduction under Section 80E (no upper limit)</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-bold text-gray-900 mb-1">Business Loan</h3>
                <p className="text-sm mb-2">Loans for starting or expanding a business, working capital, equipment purchase, or business operations.</p>
                <p className="text-sm"><strong>Interest Rate:</strong> 11% - 20% per annum</p>
                <p className="text-sm"><strong>Typical Tenure:</strong> 1-10 years</p>
                <p className="text-sm"><strong>Loan Amount:</strong> ₹1 lakh to ₹50 crores (based on business vintage and revenue)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Common Use Cases
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Home Purchase Planning:</strong> Calculate affordable property price based on your monthly budget and available down payment using the home loan calculator.</p>
              <p><strong>Car Affordability:</strong> Determine if you can afford your dream car by checking monthly EMI with different down payment scenarios using the car loan calculator.</p>
              <p><strong>Loan Comparison:</strong> Compare offers from multiple banks or NBFCs by entering different interest rates to find the cheapest loan option.</p>
              <p><strong>Pre-Approval Budget:</strong> Know your exact monthly commitment before applying for a loan to ensure it fits your income and expenses.</p>
              <p><strong>Refinancing Decision:</strong> Calculate if refinancing your existing loan at a lower interest rate will save money after considering processing fees.</p>
              <p><strong>Tenure Optimization:</strong> Compare short tenure (lower total interest) vs long tenure (lower monthly EMI) to choose what works best for you.</p>
              <p><strong>Down Payment Strategy:</strong> See how increasing your down payment reduces both EMI and total interest payable over the loan tenure.</p>
              <p><strong>Prepayment Planning:</strong> Calculate current loan details to plan partial prepayments that can significantly reduce interest burden.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Reduce Your EMI
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">1.</span>
                <span><strong>Increase Down Payment:</strong> Higher down payment means lower principal, directly reducing your EMI. Aim for at least 20% down payment for home loans.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">2.</span>
                <span><strong>Choose Longer Tenure:</strong> Extending loan tenure reduces monthly EMI but increases total interest. Use this option if you need lower monthly payments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">3.</span>
                <span><strong>Negotiate Interest Rates:</strong> Compare offers from multiple lenders. Even 0.5% lower rate can save lakhs over a long tenure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">4.</span>
                <span><strong>Improve Credit Score:</strong> A higher CIBIL score (750+) qualifies you for lower interest rates, directly reducing your EMI.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">5.</span>
                <span><strong>Make Prepayments:</strong> Pay extra toward principal whenever possible. Most banks allow prepayment without penalty on floating rate loans.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">6.</span>
                <span><strong>Refinance Your Loan:</strong> If interest rates have dropped, consider refinancing (balance transfer) to a cheaper loan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">7.</span>
                <span><strong>Add a Co-Applicant:</strong> Having a co-borrower with good income can improve loan terms and reduce interest rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">8.</span>
                <span><strong>Choose Right Loan Type:</strong> Home loans have lower rates than personal loans. If possible, prefer secured loans over unsecured ones.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Fixed vs Floating Interest Rates
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Fixed Interest Rate:</strong> The interest rate remains constant throughout the loan tenure. Your EMI stays the same from first month to last month, making budgeting easier. Fixed rates are typically 1-2.5% higher than floating rates initially.</p>
              <p><strong>Advantages:</strong> Predictable payments, protection from rate hikes, easier financial planning, no surprise increases.</p>
              <p><strong>Disadvantages:</strong> No benefit if market rates fall, higher initial rates, less flexibility.</p>
              
              <p className="pt-2"><strong>Floating Interest Rate:</strong> The interest rate fluctuates based on market conditions and RBI policy rates. Your EMI can increase or decrease during the loan tenure. Most home loans in India are on floating rates.</p>
              <p><strong>Advantages:</strong> Lower initial rates, benefit when interest rates fall, can switch to fixed rate later.</p>
              <p><strong>Disadvantages:</strong> EMI uncertainty, can increase significantly if rates rise, difficult to budget long-term.</p>
              
              <p className="pt-2"><strong>Recommendation:</strong> Floating rates are generally better for long-tenure loans like home loans, as rates tend to decrease over time. Fixed rates work well for short-tenure loans or if you expect rates to rise significantly.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              EMI to Income Ratio Guidelines
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">EMI / Income Ratio</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Financial Health</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-t border-gray-200 bg-green-50">
                    <td className="px-4 py-2 font-semibold">Below 30%</td>
                    <td className="px-4 py-2">Excellent</td>
                    <td className="px-4 py-2">Comfortable repayment, room for savings and emergencies</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">30% - 40%</td>
                    <td className="px-4 py-2">Good</td>
                    <td className="px-4 py-2">Manageable, maintain emergency fund</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-yellow-50">
                    <td className="px-4 py-2 font-semibold">40% - 50%</td>
                    <td className="px-4 py-2">Moderate</td>
                    <td className="px-4 py-2">Tight budget, avoid additional loans</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-orange-50">
                    <td className="px-4 py-2 font-semibold">50% - 60%</td>
                    <td className="px-4 py-2">Strained</td>
                    <td className="px-4 py-2">Financial stress, consider prepayment or refinancing</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-red-50">
                    <td className="px-4 py-2 font-semibold">Above 60%</td>
                    <td className="px-4 py-2">Risky</td>
                    <td className="px-4 py-2">High default risk, restructure loans immediately</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm mt-3">
              <strong>Example:</strong> If your monthly income is ₹50,000 and EMI is ₹15,000, your ratio is 30% (acceptable). 
              Banks typically approve loans where total EMI doesn't exceed 50% of income.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Loan Eligibility Criteria
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Age:</strong> Typically 21-65 years. Younger applicants get longer tenure options.</p>
              <p><strong>Income:</strong> Minimum monthly income varies by lender (₹15,000 - ₹25,000 for personal loans, higher for home loans). Stable income source required.</p>
              <p><strong>Employment:</strong> Salaried employees need 2+ years work experience. Self-employed need 3+ years business vintage with profit.</p>
              <p><strong>Credit Score (CIBIL):</strong> Minimum 650 for loan approval, 750+ for best interest rates. Score above 800 gets premium rates.</p>
              <p><strong>Debt-to-Income Ratio:</strong> Total EMI (all loans) shouldn't exceed 50% of monthly income for new loan approval.</p>
              <p><strong>Down Payment:</strong> 10-20% for home loans, 10-30% for car loans. Higher down payment improves approval chances and reduces interest.</p>
              <p><strong>Documentation:</strong> ID proof, address proof, income proof (salary slips/ITR), bank statements, employment proof required.</p>
              <p><strong>Property Documents:</strong> For home loans - sale deed, NOC, approved building plans, property tax receipts, encumbrance certificate.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Tax Benefits on Home Loans
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Section 24 (Interest Deduction):</strong> Claim deduction up to ₹2,00,000 per year on home loan interest for self-occupied property. No upper limit for let-out property.</p>
              <p><strong>Section 80C (Principal Deduction):</strong> Claim deduction up to ₹1,50,000 per year on principal repayment. This is part of the overall ₹1.5 lakh limit under Section 80C.</p>
              <p><strong>Section 80EE (Additional Interest):</strong> First-time home buyers can claim additional ₹50,000 deduction on interest for loans up to ₹35 lakhs for properties valued up to ₹50 lakhs.</p>
              <p><strong>Section 80EEA:</strong> Additional ₹1,50,000 deduction on interest for affordable housing (property value up to ₹45 lakhs, loan sanctioned between April 2019 - March 2022).</p>
              <p><strong>Stamp Duty and Registration:</strong> Deduction under Section 80C for stamp duty and registration charges in the year of payment (within overall ₹1.5 lakh limit).</p>
              <p><strong>Joint Home Loan:</strong> Each co-borrower can claim separate deductions, effectively doubling the tax benefit for couples.</p>
              <p className="text-sm italic">Note: Tax laws change periodically. Consult a tax advisor for current regulations and eligibility.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Prepayment and Foreclosure
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>What is Prepayment?</strong> Paying extra money toward your loan principal before the scheduled EMI date. This reduces your outstanding principal and saves interest.</p>
              <p><strong>Partial Prepayment:</strong> Pay lump sum amounts periodically while continuing regular EMIs. You can either reduce EMI amount or reduce tenure.</p>
              <p><strong>Full Prepayment (Foreclosure):</strong> Paying the entire outstanding amount at once to close the loan. Most beneficial if you have windfall gains.</p>
              
              <p className="pt-2"><strong>Prepayment Charges:</strong></p>
              <p className="ml-4">• Floating rate loans: RBI mandates zero prepayment charges for home loans</p>
              <p className="ml-4">• Fixed rate loans: Banks can charge 2-5% prepayment penalty</p>
              <p className="ml-4">• Personal loans: Usually 2-6% prepayment charges</p>
              <p className="ml-4">• Car loans: Typically 4-6% foreclosure charges</p>
              
              <p className="pt-2"><strong>Prepayment Strategy:</strong> Best done in the first 5-7 years when interest component is highest. Even ₹10,000-50,000 prepayment annually can save lakhs in interest over 20 years.</p>
              <p><strong>Example:</strong> ₹50 lakh home loan at 9% for 20 years. Regular EMI = ₹44,986. Prepaying ₹50,000 annually saves ₹14.7 lakhs in interest and closes loan 4 years earlier!</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Top Banks and Their Current Interest Rates (2026)
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p className="text-sm text-gray-600 mb-2"><em>Note: Interest rates are indicative and change frequently based on RBI policy and lender discretion. Always check current rates before applying.</em></p>
              
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-gray-900">Home Loans:</p>
                  <p className="text-sm ml-4">• SBI, HDFC, ICICI: 8.5% - 9.5%</p>
                  <p className="text-sm ml-4">• Axis, Kotak, PNB: 8.75% - 9.75%</p>
                  <p className="text-sm ml-4">• LIC Housing, DHFL: 8.25% - 9.25%</p>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900">Car Loans:</p>
                  <p className="text-sm ml-4">• SBI, HDFC, ICICI: 8.7% - 11%</p>
                  <p className="text-sm ml-4">• Bajaj Finserv, Tata Capital: 9.5% - 12%</p>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900">Personal Loans:</p>
                  <p className="text-sm ml-4">• HDFC, ICICI, SBI: 10.5% - 21%</p>
                  <p className="text-sm ml-4">• Bajaj Finserv: 11% - 22%</p>
                  <p className="text-sm ml-4">• NBFCs: 12% - 24%</p>
                </div>
              </div>
              
              <p className="pt-2"><strong>Rate Factors:</strong> Your actual rate depends on credit score, income, employment type, loan amount, tenure, and relationship with bank. Premium customers get 0.5-1% lower rates.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Common Loan Mistakes to Avoid
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>Not Comparing Offers:</strong> Don't accept the first loan offer. Compare at least 3-5 lenders for interest rates, processing fees, and prepayment terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>Ignoring Hidden Charges:</strong> Processing fees, documentation charges, insurance, and late payment penalties can add significantly to loan cost.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>Maxing Out Eligibility:</strong> Just because you're eligible for ₹50 lakhs doesn't mean you should borrow that much. Keep EMI below 40% of income.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>Choosing Longest Tenure:</strong> While it reduces EMI, longer tenure means paying 2-3x more in total interest over the loan life.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>No Emergency Fund:</strong> Don't empty all savings for down payment. Maintain 6-12 months expenses as emergency fund.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>Ignoring Insurance:</strong> Term insurance and health insurance are crucial when you have loan obligations. Don't burden family with loan in case of emergency.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>Missing EMI Payments:</strong> Even one missed payment damages credit score. Set up auto-debit to never miss EMI dates.</span>
</li>
<li className="flex items-start gap-2">
<span className="text-red-600 font-bold">✗</span>
<span><strong>Not Reading Fine Print:</strong> Understand prepayment clauses, rate revision terms, foreclosure charges, and default penalties before signing.</span>
</li>
</ul>
</section><section>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">How is EMI calculated?</h3>
            <p className="text-gray-700">EMI is calculated using the formula: [P × R × (1+R)^N] / [(1+R)^N-1], where P is principal, R is monthly interest rate (annual rate ÷ 12 ÷ 100), and N is tenure in months. Our calculator does this automatically for accurate results.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">What is a good EMI to income ratio?</h3>
            <p className="text-gray-700">Financial experts recommend keeping total EMI below 40-50% of monthly income. Below 30% is excellent, 30-40% is good, 40-50% is acceptable, and above 50% is risky. This ensures you have enough for living expenses and savings.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Should I choose short or long loan tenure?</h3>
            <p className="text-gray-700">Short tenure means higher EMI but much lower total interest. Long tenure means lower EMI but significantly higher total cost. Choose based on your monthly budget - if EMI is comfortable at 40% income, prefer shorter tenure to save on interest.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Can I prepay my loan to reduce EMI?</h3>
            <p className="text-gray-700">Yes, prepaying reduces outstanding principal. You can either reduce EMI amount (keeping tenure same) or reduce tenure (keeping EMI same). Most banks allow free prepayment on floating rate home loans. Check for prepayment charges on other loan types.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">What happens if I miss an EMI payment?</h3>
            <p className="text-gray-700">Missing EMI leads to late payment charges (typically ₹500-1000), damages your credit score, and after 90 days the loan becomes NPA (Non-Performing Asset). Banks can initiate legal action and seize collateral. Always inform bank in advance if facing payment difficulty.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Is EMI same every month?</h3>
            <p className="text-gray-700">For fixed rate loans, EMI remains constant. For floating rate loans, EMI can change when interest rates change (typically reviewed quarterly or annually). In early years, most EMI goes toward interest; in later years, more goes toward principal.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">How does down payment affect EMI?</h3>
            <p className="text-gray-700">Higher down payment = lower loan amount = lower EMI. For example, ₹50 lakh property with ₹10 lakh down payment means ₹40 lakh loan. With ₹15 lakh down payment, loan reduces to ₹35 lakh, reducing EMI by about 12.5%.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Can I get a home loan without a job?</h3>
            <p className="text-gray-700">Salaried employment helps, but self-employed individuals, business owners, and freelancers can get loans by showing income tax returns, business financial statements, and bank statements proving regular income. Requirements are stricter without salaried job.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">What is the difference between EMI and interest?</h3>
            <p className="text-gray-700">EMI is the total monthly payment (principal + interest). In early months, interest is the major component. As principal reduces, interest reduces and principal component increases. Use amortization schedule to see exact breakdown for each month.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">How can I improve my loan eligibility?</h3>
            <p className="text-gray-700">Improve CIBIL score to 750+, increase income, add co-applicant, reduce existing EMIs, maintain steady employment, save for larger down payment, maintain good banking relationship, and keep debt-to-income ratio below 40%.</p>
          </div>
        </div>
      </section>
    </div>
      </div>
    </main>
  );
}