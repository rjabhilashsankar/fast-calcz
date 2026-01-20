"use client";

import { useState } from "react";

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState("15");
  const [numPeople, setNumPeople] = useState("1");
  const [customTip, setCustomTip] = useState("");

  const commonTips = [10, 15, 18, 20, 25];

  function selectTip(percent: number) {
    setTipPercent(percent.toString());
    setCustomTip("");
  }

  function handleCustomTip(value: string) {
    setCustomTip(value);
    setTipPercent(value);
  }

  function shareResults(totalPerPerson: string) {
    const text = `Tip Calculator Result:\nBill: ${billAmount}\nTip: ${tipPercent}%\nPer Person: ${totalPerPerson}\n\nCalculate your tips easily!`;
    
    if (navigator.share) {
      navigator.share({ title: "My Tip Calculation", text: text })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Share failed:', error);
          }
        });
    } else {
      navigator.clipboard.writeText(text);
      alert("📋 Copied to clipboard!");
    }
  }

  // Calculations
  const bill = Number(billAmount);
  const tip = Number(tipPercent);
  const people = Number(numPeople);

  let tipAmount = 0;
  let totalAmount = 0;
  let perPersonAmount = 0;
  let tipPerPerson = 0;
  let hasResult = false;

  if (bill > 0 && tip >= 0 && people > 0) {
    tipAmount = (bill * tip) / 100;
    totalAmount = bill + tipAmount;
    perPersonAmount = totalAmount / people;
    tipPerPerson = tipAmount / people;
    hasResult = true;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Tip Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Calculate tips and split bills easily • Perfect for restaurants and services
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-4 sm:gap-6 items-start">
          {/* LEFT: Calculator */}
          <section>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200">
              <div className="space-y-5">
                {/* Bill Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bill Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 text-lg text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Tip Percentage Buttons */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Tip %
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {commonTips.map((percent) => (
                      <button
                        key={percent}
                        onClick={() => selectTip(percent)}
                        className={`py-3 rounded-lg font-bold text-sm transition-all ${
                          tipPercent === percent.toString() && !customTip
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Tip */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Tip %
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter custom %"
                      value={customTip}
                      onChange={(e) => handleCustomTip(e.target.value)}
                      className="w-full px-4 py-3 pr-10 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold pointer-events-none">
                      %
                    </span>
                  </div>
                </div>

                {/* Number of People */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of People
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setNumPeople(Math.max(1, Number(numPeople) - 1).toString())}
                      className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-xl transition-all"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={numPeople}
                      onChange={(e) => setNumPeople(e.target.value)}
                      className="flex-1 px-4 py-3 text-center text-lg text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                    <button
                      onClick={() => setNumPeople((Number(numPeople) + 1).toString())}
                      className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-xl transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Tip Guide:</strong> 15-20% for good service, 20-25% for excellent service, 10% for basic service
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: Result */}
          <aside className="lg:sticky lg:top-6">
            {hasResult ? (
              <>
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-200">
                  {/* Total Per Person - Main Result */}
                  <div className="text-center pb-4 mb-4 border-b border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Per Person
                    </div>
                    <div className="text-4xl sm:text-5xl font-bold text-indigo-600">
                      ${perPersonAmount.toFixed(2)}
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bill Total</span>
                      <span className="text-lg font-bold text-gray-900">${bill.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tip ({tip}%)</span>
                      <span className="text-lg font-bold text-green-600">${tipAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                      <span className="text-xl font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Split Details */}
                  {people > 1 && (
                    <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                      <div className="text-xs font-semibold text-indigo-900 mb-2">Split Between {people} People</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-indigo-700">Bill per person:</span>
                        <span className="font-bold text-indigo-900">${(bill / people).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-indigo-700">Tip per person:</span>
                        <span className="font-bold text-indigo-900">${tipPerPerson.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Tip Percentage Info */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-indigo-600">
                        {tip >= 20 ? "🌟 Generous!" : tip >= 15 ? "👍 Standard" : tip >= 10 ? "💰 Basic" : "Tip Added"}
                      </div>
                      <div className="text-xs text-indigo-700 mt-1">
                        {tip >= 20 ? "Excellent service tip" : tip >= 15 ? "Good service tip" : tip >= 10 ? "Basic service tip" : "Custom tip amount"}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Share Button */}
                <button
                  onClick={() => shareResults(perPersonAmount.toFixed(2))}
                  className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  Share Result
                </button>
              </>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300 text-center">
                <div className="text-4xl mb-2">💵</div>
                <div className="text-gray-600 text-sm font-medium">
                  Enter bill amount to calculate tip
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* SEO Content */}
        <div className="mt-12 space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Use the Tip Calculator
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our free tip calculator helps you quickly calculate the appropriate tip amount and split bills among multiple people. 
              Simply enter your bill amount, select or enter your desired tip percentage, and specify how many people are splitting 
              the bill. The calculator instantly shows the tip amount, total bill, and how much each person should pay.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Perfect for dining at restaurants, ordering delivery, getting haircuts, using taxi or rideshare services, or any 
              service where tipping is customary. No more mental math or awkward bill splitting at the table!
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Tipping Guide: How Much Should You Tip?
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Restaurants (Full Service)</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• <strong>Excellent service:</strong> 20-25%</li>
                  <li>• <strong>Good service:</strong> 15-20%</li>
                  <li>• <strong>Average service:</strong> 15%</li>
                  <li>• <strong>Poor service:</strong> 10-12% (consider speaking to manager)</li>
                </ul>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Food Delivery</h3>
                <p className="text-gray-700">15-20% of total bill, minimum $3-5 for small orders. Add more for bad weather or long distances.</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Bars and Bartenders</h3>
                <p className="text-gray-700">$1-2 per drink, or 15-20% of total tab. Higher for craft cocktails or excellent service.</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Taxi and Rideshare (Uber, Lyft)</h3>
                <p className="text-gray-700">15-20% of fare. More for helping with luggage or extraordinary service.</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Hair Salon and Barber</h3>
                <p className="text-gray-700">15-20% for haircuts. 10-20% for other services. Tip each service provider separately.</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Hotel Housekeeping</h3>
                <p className="text-gray-700">$2-5 per night, left daily. More for luxury hotels or extra services.</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Coffee Shops</h3>
                <p className="text-gray-700">$1-2 per drink or 10-15% for large orders. Tipping jar or digital tip options usually available.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Calculate Tip: Step-by-Step Guide
            </h2>
            <div className="space-y-3">
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-1">Step 1: Determine Tip Percentage</p>
                <p className="text-gray-700 text-sm">Decide how much you want to tip based on service quality (typically 15-20% for restaurants).</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-1">Step 2: Calculate Tip Amount</p>
                <p className="text-gray-700 text-sm">Multiply the bill by the tip percentage: Tip = Bill × (Tip % ÷ 100)</p>
                <p className="text-gray-700 text-sm mt-1"><strong>Example:</strong> $50 bill × 20% = $50 × 0.20 = $10 tip</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-1">Step 3: Add to Bill</p>
                <p className="text-gray-700 text-sm">Total = Bill + Tip. In our example: $50 + $10 = $60 total</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-1">Step 4: Split if Needed</p>
                <p className="text-gray-700 text-sm">Divide the total by number of people. $60 ÷ 3 people = $20 per person</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Quick Tip Calculation Tricks
            </h2>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Calculate 20% Tip Mentally</h3>
                <p className="text-gray-700 text-sm">Move the decimal point one place left (10%), then double it. Example: $45 → $4.50 × 2 = $9 tip</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Calculate 15% Tip Mentally</h3>
                <p className="text-gray-700 text-sm">Find 10% (move decimal left), then add half of that. Example: $40 → $4 + $2 = $6 tip</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Round Up for Simplicity</h3>
                <p className="text-gray-700 text-sm">If tip is $7.65, round to $8 for easier payment and slightly better tip.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions About Tipping
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What is the standard tip percentage?</h3>
                <p className="text-gray-700">In the United States, the standard tip for restaurant service is 15-20%. For excellent service, 20-25% is appropriate. Other countries may have different customs, with some including service charges automatically.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Should I tip on the pre-tax or post-tax amount?</h3>
                <p className="text-gray-700">Traditionally, tips are calculated on the pre-tax amount. However, many people tip on the total including tax, which results in a slightly higher tip. Either method is acceptable.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do I split a tip among multiple people?</h3>
                <p className="text-gray-700">Calculate the total tip amount, then divide by the number of people. Our calculator does this automatically - just enter the number of people splitting the bill.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Is it okay to tip less than 15%?</h3>
                <p className="text-gray-700">While 15% is considered the minimum for acceptable service, if service was truly poor, you can tip less. However, consider speaking to a manager about service issues rather than just leaving a low tip.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Should I tip on takeout orders?</h3>
                <p className="text-gray-700">For takeout, 10% is customary, though not required. If someone took time to package your order carefully or the restaurant went above and beyond, consider tipping 15-20%.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Do I need to tip if gratuity is included?</h3>
                <p className="text-gray-700">If gratuity or service charge is already included in your bill (common for large parties), you don't need to add additional tip unless service was exceptional.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How much should I tip for buffet service?</h3>
                <p className="text-gray-700">For buffets, tip 10-15% since servers do less work than full service. Tip based on drink refills, clearing plates, and overall attentiveness.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Is tipping required by law?</h3>
                <p className="text-gray-700">No, tipping is not legally required in most countries. However, in the US, many service workers rely on tips as a significant part of their income, as base wages can be very low.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can I use this calculator for international tipping?</h3>
                <p className="text-gray-700">Yes, though tipping customs vary by country. Research local tipping etiquette - some countries include service charges, while others consider tipping unnecessary or even offensive.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Should I tip delivery drivers during bad weather?</h3>
                <p className="text-gray-700">Yes, absolutely! Tip extra (25-30% or more) when drivers deliver in rain, snow, or extreme heat. They're going out of their way in difficult conditions.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why Use a Tip Calculator?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Speed and Convenience</h3>
                <p className="text-gray-700 text-sm">Calculate tips instantly without mental math. Perfect when you're in a hurry or splitting bills with friends.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Accuracy</h3>
                <p className="text-gray-700 text-sm">Avoid calculation errors that could lead to under-tipping or over-tipping. Get precise amounts every time.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Fair Splitting</h3>
                <p className="text-gray-700 text-sm">Easily split bills among any number of people. Everyone pays their fair share including tip.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Multiple Options</h3>
                <p className="text-gray-700 text-sm">Try different tip percentages to see how they affect your total. Choose what feels right for the service.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}