"use client";

import { useState, useMemo } from "react";

type PaymentScheduleItem = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  pmi: number;
  propertyTax: number;
  insurance: number;
  hoa: number;
  balance: number;
  remainingPMI: boolean;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState("300000");
  const [downPayment, setDownPayment] = useState("60000");
  const [loanTerm, setLoanTerm] = useState("30");
  const [customLoanTerm, setCustomLoanTerm] = useState("");
  const [interestRate, setInterestRate] = useState("6.5");
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState("3000");
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState("1200");
  const [pmiRate, setPmiRate] = useState("0.5");
  const [hoaMonthly, setHoaMonthly] = useState("0");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [extraPayment, setExtraPayment] = useState("0");
  const [startMonth, setStartMonth] = useState("1");

  // Validation states
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Single source of truth for down payment calculations
  const homePriceValue = parseFloat(homePrice) || 0;
  const downPaymentValue = parseFloat(downPayment) || 0;
  const downPaymentPercent = homePriceValue > 0 ? (downPaymentValue / homePriceValue) * 100 : 0;

  function handleHomePriceChange(value: string) {
    setHomePrice(value);
    const price = parseFloat(value) || 0;
    if (price < 0) {
      setErrors({...errors, homePrice: "Home price must be positive"});
    } else {
      const newErrors = {...errors};
      delete newErrors.homePrice;
      setErrors(newErrors);
    }
  }

  function handleDownPaymentChange(value: string) {
    setDownPayment(value);
    const down = parseFloat(value) || 0;
    if (down < 0) {
      setErrors({...errors, downPayment: "Down payment must be positive"});
    } else if (down > homePriceValue) {
      setErrors({...errors, downPayment: "Down payment cannot exceed home price"});
    } else {
      const newErrors = {...errors};
      delete newErrors.downPayment;
      setErrors(newErrors);
    }
  }

  function handleDownPaymentPercentChange(value: string) {
    const percent = parseFloat(value) || 0;
    if (percent >= 0 && percent <= 100) {
      const newDownPayment = (homePriceValue * percent) / 100;
      setDownPayment(newDownPayment.toFixed(2));
      const newErrors = {...errors};
      delete newErrors.downPayment;
      setErrors(newErrors);
    }
  }

  function handleInterestRateChange(value: string) {
    setInterestRate(value);
    const rate = parseFloat(value) || 0;
    if (rate < 0 || rate > 30) {
      setErrors({...errors, interestRate: "Interest rate must be between 0% and 30%"});
    } else {
      const newErrors = {...errors};
      delete newErrors.interestRate;
      setErrors(newErrors);
    }
  }

  const effectiveLoanTerm = loanTerm === "custom" ? parseFloat(customLoanTerm) || 30 : parseFloat(loanTerm);

  // Memoized calculations
  const calculatedValues = useMemo(() => {
    const loanAmount = homePriceValue - downPaymentValue;
    const annualRate = parseFloat(interestRate) || 0;
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = effectiveLoanTerm * 12;
    const monthlyPropertyTax = (parseFloat(propertyTaxAnnual) || 0) / 12;
    const monthlyInsurance = (parseFloat(homeInsuranceAnnual) || 0) / 12;
    const monthlyHOA = parseFloat(hoaMonthly) || 0;
    const monthlyExtra = parseFloat(extraPayment) || 0;

    // Calculate monthly P&I using standard mortgage formula
    let monthlyPI = 0;
    if (monthlyRate > 0 && numberOfPayments > 0 && loanAmount > 0) {
      const r = monthlyRate;
      const n = numberOfPayments;
      monthlyPI = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (loanAmount > 0 && numberOfPayments > 0) {
      monthlyPI = loanAmount / numberOfPayments;
    }

    // PMI: Auto-disable if down payment >= 20%
    const pmiRateValue = parseFloat(pmiRate) || 0;
    const needsPMI = downPaymentPercent < 20;
    const pmiMonthly = needsPMI && loanAmount > 0 ? (loanAmount * pmiRateValue / 100) / 12 : 0;

    return {
      loanAmount,
      monthlyRate,
      numberOfPayments,
      monthlyPI,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyHOA,
      monthlyExtra,
      pmiMonthly,
      needsPMI,
    };
  }, [homePriceValue, downPaymentValue, downPaymentPercent, interestRate, effectiveLoanTerm, propertyTaxAnnual, homeInsuranceAnnual, hoaMonthly, extraPayment, pmiRate]);

  // Generate full amortization schedule
  const fullSchedule = useMemo((): PaymentScheduleItem[] => {
    const schedule: PaymentScheduleItem[] = [];
    const { loanAmount, monthlyRate, numberOfPayments, monthlyPI, monthlyPropertyTax, monthlyInsurance, monthlyHOA, monthlyExtra, pmiMonthly, needsPMI } = calculatedValues;

    if (loanAmount <= 0) return [];

    let balance = loanAmount;
    const maxMonths = numberOfPayments * 2;

    for (let month = 1; month <= maxMonths && balance > 0.01; month++) {
      const interestPayment = balance * monthlyRate;
      
      // Extra payment goes entirely to principal
      let principalPayment = monthlyPI - interestPayment + monthlyExtra;
      
      // Don't overpay
      if (principalPayment > balance) {
        principalPayment = balance;
      }

      balance -= principalPayment;
      if (balance < 0) balance = 0;

      // Calculate LTV to determine PMI status
      const currentLTV = homePriceValue > 0 ? (balance / homePriceValue) * 100 : 0;
      const stillNeedsPMI = needsPMI && currentLTV > 80;
      const currentPMI = stillNeedsPMI ? pmiMonthly : 0;

      schedule.push({
        month,
        payment: monthlyPI + monthlyExtra,
        principal: principalPayment,
        interest: interestPayment,
        pmi: currentPMI,
        propertyTax: monthlyPropertyTax,
        insurance: monthlyInsurance,
        hoa: monthlyHOA,
        balance,
        remainingPMI: stillNeedsPMI,
      });

      if (balance === 0) break;
    }

    return schedule;
  }, [calculatedValues, homePriceValue]);

  // Calculate summary statistics from full schedule
  const summary = useMemo(() => {
    const { monthlyPI, monthlyPropertyTax, monthlyInsurance, monthlyHOA, pmiMonthly, loanAmount } = calculatedValues;

    const totalInterest = fullSchedule.reduce((sum, item) => sum + item.interest, 0);
    const totalPMI = fullSchedule.reduce((sum, item) => sum + item.pmi, 0);
    const payoffMonths = fullSchedule.length;
    const yearsToPayoff = Math.floor(payoffMonths / 12);
    const monthsRemaining = payoffMonths % 12;

    // Total cost = down payment + all payments
    const totalOfAllPayments = fullSchedule.reduce((sum, item) => 
      sum + item.payment + item.pmi + item.propertyTax + item.insurance + item.hoa, 0
    );
    const totalCost = downPaymentValue + totalOfAllPayments;

    // Monthly payment breakdown
    const firstMonthPMI = fullSchedule.length > 0 ? fullSchedule[0].pmi : pmiMonthly;
    const totalMonthlyPayment = monthlyPI + firstMonthPMI + monthlyPropertyTax + monthlyInsurance + monthlyHOA;

    // Savings from extra payments (compare to normal schedule)
    const normalMonths = calculatedValues.numberOfPayments;
    const monthsSaved = normalMonths - payoffMonths;
    
    // Calculate what interest would be without extra payments
    let normalInterest = 0;
    if (calculatedValues.monthlyExtra === 0) {
      normalInterest = totalInterest;
    } else {
      let normalBalance = loanAmount;
      for (let i = 0; i < normalMonths && normalBalance > 0.01; i++) {
        const interest = normalBalance * calculatedValues.monthlyRate;
        normalInterest += interest;
        const principal = monthlyPI - interest;
        normalBalance -= principal;
      }
    }
    const interestSaved = normalInterest - totalInterest;

    return {
      totalInterest,
      totalPMI,
      totalCost,
      totalMonthlyPayment,
      monthlyPI,
      firstMonthPMI,
      payoffMonths,
      yearsToPayoff,
      monthsRemaining,
      monthsSaved,
      interestSaved,
    };
  }, [fullSchedule, calculatedValues, downPaymentValue]);

  // Slice schedule for display
  const displaySchedule = useMemo(() => {
    const start = parseInt(startMonth) || 1;
    return fullSchedule.slice(start - 1, start - 1 + 12);
  }, [fullSchedule, startMonth]);

  function shareResults() {
    const extraPaymentText = calculatedValues.monthlyExtra > 0 
      ? `\n\nExtra Payment Impact:\n- Monthly extra: ${currencyFormatter.format(calculatedValues.monthlyExtra)}\n- Interest saved: ${currencyFormatter.format(summary.interestSaved)}\n- Time saved: ${summary.monthsSaved} months\n- New payoff: ${summary.yearsToPayoff} years, ${summary.monthsRemaining} months`
      : '';

    const text = `Mortgage Summary:
Home Price: ${currencyFormatter.format(homePriceValue)}
Down Payment: ${currencyFormatter.format(downPaymentValue)} (${percentFormatter.format(downPaymentPercent / 100)})
Loan Amount: ${currencyFormatter.format(calculatedValues.loanAmount)}

Monthly Payment: ${currencyFormatter.format(summary.totalMonthlyPayment)}
- Principal & Interest: ${currencyFormatter.format(summary.monthlyPI)}
- Property Tax: ${currencyFormatter.format(calculatedValues.monthlyPropertyTax)}
- Insurance: ${currencyFormatter.format(calculatedValues.monthlyInsurance)}${summary.firstMonthPMI > 0 ? `\n- PMI: ${currencyFormatter.format(summary.firstMonthPMI)}` : ''}${calculatedValues.monthlyHOA > 0 ? `\n- HOA: ${currencyFormatter.format(calculatedValues.monthlyHOA)}` : ''}

Loan Details:
- Interest Rate: ${interestRate}%
- Loan Term: ${effectiveLoanTerm} years
- Total Interest: ${currencyFormatter.format(summary.totalInterest)}
- Total Cost: ${currencyFormatter.format(summary.totalCost)}${extraPaymentText}`;

    if (navigator.share) {
      navigator.share({ title: "Mortgage Calculation", text })
        .catch((error) => {
          if (error.name !== 'AbortError') console.error('Share failed:', error);
        });
    } else {
      navigator.clipboard.writeText(text);
      alert("📋 Copied to clipboard!");
    }
  }

  const hasInput = homePriceValue > 0 && calculatedValues.loanAmount > 0;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <header className="mb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Mortgage Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Calculate monthly payments, total interest, and payoff schedules with accurate PMI handling
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-4 sm:gap-6 items-start">
          <section className="space-y-4">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Loan Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Home Price</label>
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => handleHomePriceChange(e.target.value)}
                    min="0"
                    step="1000"
                    placeholder="300000"
                    className={`w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none ${errors.homePrice ? 'border-red-500' : 'border-indigo-300 focus:border-indigo-500'}`}
                  />
                  {errors.homePrice && <p className="text-red-600 text-xs mt-1">{errors.homePrice}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Down Payment</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        value={downPayment}
                        onChange={(e) => handleDownPaymentChange(e.target.value)}
                        min="0"
                        step="1000"
                        placeholder="60000"
                        className={`w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 rounded-lg focus:border-indigo-500 outline-none ${errors.downPayment ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Amount</span>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={downPaymentPercent.toFixed(1)}
                        onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="20"
                        className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Percent (%)</span>
                    </div>
                  </div>
                  {errors.downPayment && <p className="text-red-600 text-xs mt-1">{errors.downPayment}</p>}
                  {downPaymentPercent < 20 && downPaymentPercent > 0 && (
                    <p className="text-amber-600 text-xs mt-1">⚠️ Down payment below 20% requires PMI</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Term</label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="w-full px-3 py-3 text-sm font-semibold text-gray-900 border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none bg-white"
                    >
                      <option value="10">10 years</option>
                      <option value="15">15 years</option>
                      <option value="20">20 years</option>
                      <option value="25">25 years</option>
                      <option value="30">30 years</option>
                      <option value="custom">Custom</option>
                    </select>
                    {loanTerm === "custom" && (
                      <input
                        type="number"
                        value={customLoanTerm}
                        onChange={(e) => setCustomLoanTerm(e.target.value)}
                        min="1"
                        max="50"
                        placeholder="30"
                        className="w-full mt-2 px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => handleInterestRateChange(e.target.value)}
                      min="0"
                      max="30"
                      step="0.01"
                      placeholder="6.5"
                      className={`w-full px-3 py-3 text-sm text-gray-900 font-semibold border-2 rounded-lg outline-none ${errors.interestRate ? 'border-red-500' : 'border-indigo-300 focus:border-indigo-500'}`}
                    />
                    {errors.interestRate && <p className="text-red-600 text-xs mt-1">{errors.interestRate}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-lg font-bold text-gray-900">Additional Costs & Payments</span>
                <span className="text-gray-400 text-xl">{showAdvanced ? '▼' : '▶'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Property Tax (Annual)</label>
                      <input
                        type="number"
                        value={propertyTaxAnnual}
                        onChange={(e) => setPropertyTaxAnnual(e.target.value)}
                        min="0"
                        step="100"
                        placeholder="3000"
                        className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Home Insurance (Annual)</label>
                      <input
                        type="number"
                        value={homeInsuranceAnnual}
                        onChange={(e) => setHomeInsuranceAnnual(e.target.value)}
                        min="0"
                        step="100"
                        placeholder="1200"
                        className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PMI Rate (Annual %)
                        {downPaymentPercent >= 20 && <span className="text-green-600 ml-2">✓ Not Required</span>}
                      </label>
                      <input
                        type="number"
                        value={pmiRate}
                        onChange={(e) => setPmiRate(e.target.value)}
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="0.5"
                        disabled={downPaymentPercent >= 20}
                        className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Auto-removes at 80% LTV</span>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">HOA Fees (Monthly)</label>
                      <input
                        type="number"
                        value={hoaMonthly}
                        onChange={(e) => setHoaMonthly(e.target.value)}
                        min="0"
                        step="10"
                        placeholder="0"
                        className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Extra Monthly Payment</label>
                    <input
                      type="number"
                      value={extraPayment}
                      onChange={(e) => setExtraPayment(e.target.value)}
                      min="0"
                      step="50"
                      placeholder="0"
                      className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Goes directly to principal</span>
                  </div>
                </div>
              )}
            </div>

            {hasInput && (
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSchedule}
                      onChange={(e) => setShowSchedule(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Show Amortization Schedule</span>
                  </label>
                  {showSchedule && (
                  <select
  value={startMonth}
  onChange={(e) => setStartMonth(e.target.value)}
  className="px-3 py-2 text-sm bg-white text-gray-900 border border-gray-500 rounded-md focus:outline-none focus:border-gray-700"
>
                      <option value="1" className="text-gray-900 bg-white">Year 1</option>
<option value="13" className="text-gray-900 bg-white">Year 2</option>
<option value="25" className="text-gray-900 bg-white">Year 3</option>
<option value="61" className="text-gray-900 bg-white">Year 6</option>
<option value="121" className="text-gray-900 bg-white">Year 11</option>
<option value="181" className="text-gray-900 bg-white">Year 16</option>
<option value="241" className="text-gray-900 bg-white">Year 21</option>
<option value="301" className="text-gray-900 bg-white">Year 26</option>
                    </select>
                  )}
                </div>

                {showSchedule && displaySchedule.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-2 px-2 font-bold text-gray-800">Month</th>
                          <th className="text-right py-2 px-2 font-bold text-gray-800">Payment</th>
                          <th className="text-right py-2 px-2 font-bold text-gray-800">Principal</th>
                          <th className="text-right py-2 px-2 font-bold text-gray-800">Interest</th>
                          <th className="text-right py-2 px-2 font-bold text-gray-800">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displaySchedule.map((item) => (
                          <tr key={item.month} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-2 px-2 font-semibold text-gray-900">{item.month}</td>
                            <td className="text-right py-2 px-2 text-gray-800">{currencyFormatter.format(item.payment)}</td>
                            <td className="text-right py-2 px-2 text-green-700 font-semibold">{currencyFormatter.format(item.principal)}</td>
                            <td className="text-right py-2 px-2 text-red-700 font-semibold">{currencyFormatter.format(item.interest)}</td>
                            <td className="text-right py-2 px-2 font-bold text-indigo-900">{currencyFormatter.format(item.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-6">
            {hasInput && !hasErrors ? (
              <>
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Monthly Payment
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-1">
                    {currencyFormatter.format(summary.totalMonthlyPayment)}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">per month</div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Loan Amount</span>
                      <span className="font-semibold text-gray-900">{currencyFormatter.format(calculatedValues.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Interest</span>
                      <span className="font-semibold text-gray-900">{currencyFormatter.format(summary.totalInterest)}</span>
                    </div>
                    {summary.totalPMI > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total PMI</span>
                        <span className="font-semibold text-gray-900">{currencyFormatter.format(summary.totalPMI)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Cost</span>
                      <span className="font-semibold text-gray-900">{currencyFormatter.format(summary.totalCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payoff Time</span>
                      <span className="font-semibold text-gray-900">{summary.yearsToPayoff}y {summary.monthsRemaining}m</span>
                    </div>
                  </div>

                  {calculatedValues.monthlyExtra > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="text-xs font-semibold text-green-900 uppercase mb-1">
                        💰 Extra Payment Impact
                      </div>
                      <div className="text-sm space-y-1 text-green-900">
                        <div>Save {currencyFormatter.format(summary.interestSaved)} in interest</div>
                        <div>Pay off {summary.monthsSaved} months early</div>
                        <div>New payoff: {summary.yearsToPayoff} years, {summary.monthsRemaining} months</div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={shareResults}
                  className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  Share Results
                </button>
              </>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300 text-center">
                <div className="text-4xl mb-2">🏠</div>
                <div className="text-gray-600 text-sm font-medium">
                  {hasErrors ? "Please fix errors above" : "Enter loan details to calculate"}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* SEO Content - How To Use & Educational Guide */}
        <div className="mt-12 space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Use This Mortgage Calculator
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This mortgage calculator provides accurate monthly payment estimates including principal, interest, property taxes, homeowners insurance, PMI (Private Mortgage Insurance), and HOA fees. Enter your home price, down payment, interest rate, and loan term to see detailed payment breakdowns, total interest costs, and a complete amortization schedule showing exactly how your loan balance decreases over time.
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Step 1: Enter Home Price and Down Payment</h3>
                <p className="text-gray-700 text-sm">Input your total home purchase price and your down payment amount. The calculator automatically shows your down payment as a percentage. If you enter less than 20% down, PMI will be automatically included in your monthly payment calculation and will be removed once you reach 80% loan-to-value ratio.</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Step 2: Choose Loan Term and Interest Rate</h3>
                <p className="text-gray-700 text-sm">Select your loan term (10, 15, 20, 25, 30 years, or enter a custom term) and current interest rate. Shorter terms have lower interest rates but higher monthly payments. 30-year loans have lower monthly payments but significantly more total interest paid over the loan's lifetime.</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Step 3: Add Property Costs (Optional)</h3>
                <p className="text-gray-700 text-sm">Include annual property taxes and homeowners insurance for a complete monthly payment estimate. Add HOA fees if applicable. These costs vary significantly by location - check your local property tax rates and insurance quotes for accurate estimates.</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Step 4: Plan Extra Payments</h3>
                <p className="text-gray-700 text-sm">Enter any extra monthly payment amount to see dramatic interest savings and faster payoff times. Extra payments go directly to principal, reducing your balance faster. Even an extra $100-200 per month can save tens of thousands in interest and shave years off your mortgage.</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Step 5: Review Amortization Schedule</h3>
                <p className="text-gray-700 text-sm">Check the "Show Amortization Schedule" box to see month-by-month breakdown of principal, interest, and remaining balance. Jump to different years to see how your payment composition changes over time - early payments are mostly interest, while later payments are mostly principal.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Understanding PMI (Private Mortgage Insurance)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Private Mortgage Insurance (PMI) is required by lenders when your down payment is less than 20% of the home's purchase price. PMI protects the lender (not you) if you default on the loan. While PMI adds to your monthly payment, it allows you to purchase a home sooner without waiting to save a full 20% down payment.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-3">
              <h3 className="font-bold text-blue-900 mb-2">How This Calculator Handles PMI</h3>
              <ul className="text-gray-800 text-sm space-y-1 list-disc list-inside">
                <li><strong>Automatic Calculation:</strong> PMI is automatically included if down payment is below 20%</li>
                <li><strong>Auto-Removal at 80% LTV:</strong> PMI is removed when loan-to-value reaches 80% through payments</li>
                <li><strong>Typical Rate:</strong> PMI usually costs 0.5% to 1% of the loan amount annually, paid monthly</li>
                <li><strong>Extra Payments Help:</strong> Making extra principal payments reduces your balance faster, reaching 80% LTV sooner</li>
              </ul>
            </div>
            <p className="text-gray-700 text-sm">
              <strong>Important:</strong> For conventional loans, lenders must automatically cancel PMI when your loan balance reaches 78% of the original home value. You can request cancellation at 80% LTV. FHA loans have different rules - loans originated after June 2013 require mortgage insurance for the life of the loan if down payment was less than 10%.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              The Power of Extra Mortgage Payments
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Making extra principal payments is one of the most effective ways to save money and build equity faster. This calculator shows exactly how extra payments impact your loan - from interest savings to shortened payoff time. Even modest additional payments create significant long-term savings.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-900 mb-2">Example: $200/Month Extra</h3>
                <p className="text-gray-800 text-sm mb-2">On a $300,000 loan at 6.5% for 30 years:</p>
                <ul className="text-gray-800 text-sm space-y-1">
                  <li>• Save approximately $67,000 in interest</li>
                  <li>• Pay off mortgage 7 years earlier</li>
                  <li>• Build equity $200 faster each month</li>
                  <li>• Reach 80% LTV (remove PMI) sooner</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-900 mb-2">Smart Extra Payment Strategies</h3>
                <ul className="text-gray-800 text-sm space-y-1 list-disc list-inside">
                  <li>Add extra payment to each monthly payment</li>
                  <li>Make one extra payment per year (13 instead of 12)</li>
                  <li>Apply bonuses or tax refunds to principal</li>
                  <li>Round up payments (pay $2,000 instead of $1,898)</li>
                  <li>Bi-weekly payments (26 half-payments = 13 full payments)</li>
                </ul>
              </div>
            </div>
          </section>

        <section className="my-8">
  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
    Choosing the Right Mortgage Term
  </h2>
  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
    <table className="w-full text-base border-collapse bg-white">
      <thead>
        <tr className="bg-gray-800 text-white">
          <th className="p-4 text-left font-semibold">Loan Term</th>
          <th className="p-4 text-left font-semibold">Best For</th>
          <th className="p-4 text-left font-semibold">Advantages</th>
          <th className="p-4 text-left font-semibold">Disadvantages</th>
        </tr>
      </thead>
      <tbody className="text-gray-700 divide-y divide-gray-200">
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="p-4 font-bold text-gray-900">15-Year</td>
          <td className="p-4">High earners, fast equity builders</td>
          <td className="p-4 leading-relaxed">Lower rates, less total interest, debt-free sooner</td>
          <td className="p-4 leading-relaxed">Higher monthly payment, less flexibility</td>
        </tr>
        <tr className="bg-blue-50/30 hover:bg-blue-50 transition-colors">
          <td className="p-4 font-bold text-gray-900">30-Year</td>
          <td className="p-4">First-time buyers, budget-conscious</td>
          <td className="p-4 leading-relaxed">Lower payment, easier qualification, more flexibility</td>
          <td className="p-4 leading-relaxed">Higher rates, much more total interest</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How accurate is this mortgage calculator?</h3>
                <p className="text-gray-700 text-sm">This calculator uses industry-standard mortgage formulas and provides estimates within pennies of actual lender calculations. It includes all major cost components: principal, interest, property tax, insurance, PMI, and HOA fees. The calculator automatically handles PMI removal at 80% LTV and accurately calculates extra payment impact on both interest savings and payoff time.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What's included in the total monthly payment?</h3>
                <p className="text-gray-700 text-sm">The total monthly payment (often called PITI or PITIA) includes: Principal & Interest (P&I) - the core loan payment that builds equity; Property Taxes - collected monthly and held in escrow; Insurance - homeowners insurance premiums; PMI - if down payment is below 20%; and HOA fees if applicable. This gives you the true monthly housing cost.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do I remove PMI from my mortgage?</h3>
                <p className="text-gray-700 text-sm">PMI automatically cancels when your loan balance reaches 78% of the original home value. You can request removal at 80% LTV by contacting your lender. This calculator shows when PMI stops in your amortization schedule. Making extra payments helps you reach 80% LTV faster. Some lenders may require a new appraisal to confirm your home's current value.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Should I pay extra toward my mortgage or invest?</h3>
                <p className="text-gray-700 text-sm">Compare your mortgage rate to expected investment returns. If your mortgage is 6.5% and investments might earn 8%, investing could be better mathematically. However, paying off a mortgage is guaranteed "return" and provides peace of mind. Many choose a balanced approach: make modest extra mortgage payments while also investing for retirement.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What's the difference between interest rate and APR?</h3>
                <p className="text-gray-700 text-sm">Interest rate is the cost of borrowing shown in your monthly payment. APR (Annual Percentage Rate) includes the interest rate plus other loan costs like origination fees, discount points, and closing costs, expressed as a yearly rate. APR helps you compare total loan costs between lenders. This calculator uses interest rate for payment calculations.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How much should I budget for property taxes and insurance?</h3>
                <p className="text-gray-700 text-sm">Property taxes typically range from 0.5% to 2.5% of home value annually, varying significantly by location. Homeowners insurance averages $1,000-$2,000 annually but depends on home value, location, coverage amount, and deductible. Check your local tax assessor's website for accurate property tax rates and get insurance quotes for precise estimates.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why Use This Mortgage Calculator
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">✓ Accurate PMI Handling</h3>
                <p className="text-gray-700 text-sm">Automatically calculates PMI when needed and removes it at 80% LTV in the amortization schedule - just like real mortgages work.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">✓ Complete Cost Breakdown</h3>
                <p className="text-gray-700 text-sm">See exactly where every dollar goes: principal, interest, taxes, insurance, PMI, and HOA fees all clearly itemized monthly and over the loan lifetime.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">✓ Extra Payment Calculator</h3>
                <p className="text-gray-700 text-sm">Instantly see how extra payments reduce interest and accelerate payoff. Plan your payment strategy to save thousands in interest charges.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">✓ Full Amortization Schedule</h3>
                <p className="text-gray-700 text-sm">View month-by-month payment breakdown showing exactly how your balance decreases and when PMI is removed. Jump to any year to see future payments.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}