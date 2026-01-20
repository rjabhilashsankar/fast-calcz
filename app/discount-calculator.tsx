"use client";

import { useState, useEffect } from "react";

type Product = {
  percent: string;
  price: string;
};

type SavedList = {
  name: string;
  products: Product[];
  date: string;
};

function ResultCard({ 
  title, 
  mainValue, 
  context, 
  breakdown, 
  insight,
  savingsPercentage 
}: { 
  title: string;
  mainValue: string;
  context: string;
  breakdown: { label: string; value: string }[];
  insight: string;
  savingsPercentage: number;
}) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-200">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {title}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
        {mainValue}
      </div>
      <div className="text-xs text-gray-600 mb-4">{context}</div>
      
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        {breakdown.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <span className="text-gray-700 font-medium">{item.label}</span>
            <span className="text-gray-900 font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
        <div className="text-green-800 font-semibold text-center text-sm">
          🎉 {insight}
        </div>
      </div>

      {/* Shopping Score */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600">📈</span>
            <span className="text-xs font-semibold text-indigo-900">Shopping Score</span>
          </div>
          <div className="text-lg font-bold text-indigo-600">
            {savingsPercentage >= 40 ? "🏆 Pro" : savingsPercentage >= 25 ? "⭐ Great" : savingsPercentage >= 15 ? "👍 Good" : "💰 Smart"}
          </div>
        </div>
        <div className="text-xs text-indigo-700 mt-1">
          {savingsPercentage >= 40 ? "Amazing deal hunter!" : 
           savingsPercentage >= 25 ? "Better than 75% of shoppers" :
           savingsPercentage >= 15 ? "Nice savings!" : "Every rupee counts"}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([{ percent: "", price: "" }]);
  const [showShareModal, setShowShareModal] = useState(false);

  function updateProduct(index: number, field: "percent" | "price", value: string) {
    const updated = [...products];
    if (field === "percent") {
      const num = Number(value);
      updated[index].percent = value === "" ? "" : Math.min(100, Math.max(0, num)).toString();
    } else {
      updated[index].price = value;
    }
    setProducts(updated);
  }

  function addProduct() {
    if (products.length >= 10) return;
    setProducts([...products, { percent: "", price: "" }]);
  }

  function removeProduct(index: number) {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== index));
  }

  function shareResults() {
    const text = `I just saved ${totalDiscount.toFixed(0)} shopping! 🎉\n\nOriginal: ${totalOriginal.toFixed(0)}\nFinal Price: ${finalTotal?.toFixed(0)}\nSavings: ${savingsPercentage.toFixed(1)}%\n\nCalculate your savings too!`;
    
    if (navigator.share) {
      navigator.share({
        title: "My Shopping Savings",
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("📋 Copied to clipboard! Share with friends.");
    }
  }

  function downloadResults() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#a855f7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('I Saved Money Shopping! 🎉', 600, 150);
    
    ctx.font = 'bold 120px Arial';
    ctx.fillText(`${totalDiscount.toFixed(0)}`, 600, 300);
    
    ctx.font = '48px Arial';
    ctx.fillText(`${savingsPercentage.toFixed(1)}% Savings`, 600, 380);
    
    ctx.font = '36px Arial';
    ctx.fillText('Calculate your savings at', 600, 500);
    ctx.fillText('MultiDiscount Calculator', 600, 550);
    
    // Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob!);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-savings.png';
      a.click();
    });
  }

  // Calculations
  let totalOriginal = 0;
  let totalDiscount = 0;
  products.forEach((p) => {
    const percent = Number(p.percent);
    const price = Number(p.price);
    if (percent > 0 && percent <= 100 && price > 0) {
      totalOriginal += price;
      totalDiscount += (price * percent) / 100;
    }
  });
  const finalTotal = totalOriginal > 0 ? totalOriginal - totalDiscount : null;
  const savingsPercentage = totalOriginal > 0 ? (totalDiscount / totalOriginal) * 100 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Multi-Product Discount Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Calculate savings across multiple products • Add up to 10 items
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-4 sm:gap-6 items-start">
          {/* LEFT: Products */}
          <section className="space-y-3">
            {products.map((product, index) => {
              const percent = Number(product.percent);
              const price = Number(product.price);
              const discountAmount = percent > 0 && price > 0 ? (price * percent) / 100 : 0;
              const finalPrice = price > 0 ? price - discountAmount : 0;

              return (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-gray-200 hover:border-indigo-300 transition-all duration-200 relative"
                >
                  {/* Close Button - Top Right */}
                  {products.length > 1 && (
                    <button
                      onClick={() => removeProduct(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                      aria-label="Remove product"
                    >
                      ×
                    </button>
                  )}

                  <div className="flex items-start gap-2 sm:gap-3">
                    {/* Product Number Badge */}
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="flex-1 space-y-2 pr-6">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {/* Discount % */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Discount %
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              placeholder="20"
                              value={product.percent}
                              onChange={(e) => updateProduct(index, "percent", e.target.value)}
                              className="w-full px-2 py-2 pr-7 text-sm sm:text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs pointer-events-none">
                              %
                            </span>
                          </div>
                        </div>

                        {/* Original Price */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Price
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="2000"
                              value={product.price}
                              onChange={(e) => updateProduct(index, "price", e.target.value)}
                              className="w-full px-2 py-2 text-sm sm:text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  {percent > 0 && price > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-600">Final: </span>
                        <span className="font-bold text-green-600">{finalPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Save: </span>
                        <span className="font-bold text-indigo-600">{discountAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={addProduct}
              disabled={products.length >= 10}
              className="w-full py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm sm:text-base shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 flex items-center justify-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Product
              <span className="text-xs opacity-80">({products.length}/10)</span>
            </button>
          </section>

          {/* RIGHT: Sticky Result */}
          <aside className="lg:sticky lg:top-6">
            {finalTotal !== null ? (
              <>
                <ResultCard
                  title="Total Payable"
                  mainValue={`₹${finalTotal.toFixed(2)}`}
                  context={`${products.length} Product${products.length > 1 ? 's' : ''}`}
                  breakdown={[
                    { label: "Total MRP", value: `₹${totalOriginal.toFixed(2)}` },
                    { label: "Total Discount", value: `-₹${totalDiscount.toFixed(2)}` },
                  ]}
                  insight={`You save ₹${totalDiscount.toFixed(2)} (${savingsPercentage.toFixed(1)}%)`}
                  savingsPercentage={savingsPercentage}
                />
                
                {/* Share Buttons */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={shareResults}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>📤</span>
                    Share
                  </button>
                  <button
                    onClick={downloadResults}
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>📸</span>
                    Image
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300 text-center">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-gray-600 text-sm font-medium">
                  Enter product details to see your savings
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* SEO Content Below Calculator */}
        <div className="mt-12 space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Use This Discount Calculator
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our multi-product discount calculator makes it easy to calculate your total savings when shopping. 
              Simply enter the discount percentage and original price for each product. The calculator instantly 
              shows the final price and how much you save on each item, plus your total savings across all products.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Perfect for comparing deals during sales, Black Friday, Cyber Monday, holiday seasons, or everyday shopping. 
              You can add up to 10 products at once and see real-time calculations as you type.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why Use Our Discount Calculator?
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Save Time:</strong> No need to manually calculate discounts for each product. Get instant results.</p>
              <p><strong>Make Better Decisions:</strong> Compare multiple products and see which deals offer the best savings.</p>
              <p><strong>Budget Effectively:</strong> Know your exact final cost before checkout. Plan your shopping within budget.</p>
              <p><strong>Avoid Sale Tricks:</strong> See the real discount amount, not just the percentage. Make informed purchases.</p>
              <p><strong>Free & Private:</strong> No registration, no data collection. Calculate as many times as you want.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Key Features
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Calculate discount for up to 10 products simultaneously</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Real-time final price and savings calculation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>See total payable amount across all items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Shopping score to gamify your savings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Share your savings with friends on social media</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Download shareable savings card as image</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Mobile-friendly and works on all devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>100% free, no ads, no sign-up required</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Common Use Cases
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Online Shopping:</strong> Calculate total cost when buying multiple items from Amazon, eBay, AliExpress, or any e-commerce site during sales.</p>
              <p><strong>Grocery Shopping:</strong> Compare discounts on different grocery items and stay within your monthly budget.</p>
              <p><strong>Holiday Sales:</strong> Make the most of Black Friday, Cyber Monday, Christmas, New Year, or seasonal offers.</p>
              <p><strong>Bulk Purchases:</strong> Calculate savings when buying office supplies, electronics, or household items in bulk.</p>
              <p><strong>Comparison Shopping:</strong> Compare the same product across different stores to find the best deal.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Discount Calculation Formula
            </h2>
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
              <p className="text-gray-800 font-mono text-sm sm:text-base">
                Discount Amount = (Original Price × Discount Percentage) ÷ 100
              </p>
              <p className="text-gray-800 font-mono text-sm sm:text-base mt-2">
                Final Price = Original Price - Discount Amount
              </p>
            </div>
            <p className="text-gray-700 mt-3 leading-relaxed">
              For example, if a product costs $2,000 with a 20% discount, the discount amount is $400, 
              making the final price $1,600. Our calculator does this instantly for all your products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Tips for Maximum Savings
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">1.</span>
                <span>Always compare the final price, not just the discount percentage. A higher percentage doesn't always mean better savings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">2.</span>
                <span>Use this calculator before festive sales to plan your budget and prioritize high-value purchases.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">3.</span>
                <span>Combine credit card offers, cashback, and coupons with sale discounts for maximum savings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">4.</span>
                <span>Share your calculations with family or shopping groups to make collective buying decisions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">5.</span>
                <span>Bookmark this page for quick access during flash sales and limited-time offers.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Is this calculator really free?</h3>
                <p className="text-gray-700">Yes! It's completely free with no hidden charges, no registration, and no ads.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can I use this on my mobile phone?</h3>
                <p className="text-gray-700">Absolutely! The calculator is fully responsive and works perfectly on all devices - phones, tablets, and desktops.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How accurate is the calculation?</h3>
                <p className="text-gray-700">Our calculator uses precise mathematical formulas to ensure 100% accurate results every time.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can I calculate GST or tax along with discount?</h3>
                <p className="text-gray-700">Currently, this calculator focuses on discount calculations. For tax calculations, you can add the tax amount to the final price manually.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What if I need to calculate more than 10 products?</h3>
                <p className="text-gray-700">You can calculate in batches of 10, note down the totals, and add them together for larger shopping lists.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}