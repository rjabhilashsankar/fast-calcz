"use client";

import { useState } from "react";

export default function BMICalculator() {
  // All inputs available at once
  const [weightKg, setWeightKg] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  // Auto-convert between units
  function handleWeightKg(value: string) {
    setWeightKg(value);
    if (value) {
      const kg = Number(value);
      setWeightLbs((kg * 2.20462).toFixed(1));
    } else {
      setWeightLbs("");
    }
  }

  function handleWeightLbs(value: string) {
    setWeightLbs(value);
    if (value) {
      const lbs = Number(value);
      setWeightKg((lbs / 2.20462).toFixed(1));
    } else {
      setWeightKg("");
    }
  }

  function handleHeightCm(value: string) {
    setHeightCm(value);
    if (value) {
      const cm = Number(value);
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      setHeightFt(feet.toString());
      setHeightIn(inches.toString());
    } else {
      setHeightFt("");
      setHeightIn("");
    }
  }

  function handleHeightFeet(value: string) {
    setHeightFt(value);
    updateHeightFromImperial(value, heightIn);
  }

  function handleHeightInches(value: string) {
    setHeightIn(value);
    updateHeightFromImperial(heightFt, value);
  }

  function updateHeightFromImperial(feet: string, inches: string) {
    const ft = Number(feet) || 0;
    const inch = Number(inches) || 0;
    if (ft > 0 || inch > 0) {
      const totalInches = (ft * 12) + inch;
      const cm = totalInches * 2.54;
      setHeightCm(cm.toFixed(0));
    } else {
      setHeightCm("");
    }
  }

  function shareResults(bmi: number, category: string) {
    const text = `My BMI: ${bmi.toFixed(1)} (${category})\n\nCalculate your BMI now!`;
    
    if (navigator.share) {
      navigator.share({ title: "My BMI Result", text: text })
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

  // Calculate BMI - use whichever system has data
  let bmi = 0;
  let hasResult = false;

  const weight = Number(weightKg);
  const height = Number(heightCm);
  
  if (weight > 0 && height > 0) {
    const heightM = height / 100;
    bmi = weight / (heightM * heightM);
    hasResult = true;
  }

  // BMI Categories
  let category = "";
  let color = "";
  let description = "";
  let healthAdvice = "";
  let emoji = "";

  if (hasResult) {
    if (bmi < 16) {
      category = "Severe Underweight";
      color = "text-red-600";
      emoji = "⚠️";
      description = "Your BMI indicates severe underweight.";
      healthAdvice = "Consult a healthcare provider immediately. This BMI level may indicate malnutrition or other health concerns.";
    } else if (bmi < 18.5) {
      category = "Underweight";
      color = "text-orange-600";
      emoji = "⚡";
      description = "Your BMI is below the healthy range.";
      healthAdvice = "Consider consulting a healthcare provider or nutritionist to develop a healthy weight gain plan.";
    } else if (bmi < 25) {
      category = "Normal Weight";
      color = "text-green-600";
      emoji = "✅";
      description = "Your BMI is in the healthy range!";
      healthAdvice = "Maintain your healthy lifestyle with balanced nutrition and regular physical activity.";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-orange-600";
      emoji = "⚡";
      description = "Your BMI is above the healthy range.";
      healthAdvice = "Consider incorporating more physical activity and balanced eating habits. Consult a healthcare provider for personalized advice.";
    } else if (bmi < 35) {
      category = "Obese Class I";
      color = "text-red-600";
      emoji = "⚠️";
      description = "Your BMI indicates obesity.";
      healthAdvice = "Consult a healthcare provider to develop a comprehensive weight management plan including diet, exercise, and medical guidance.";
    } else if (bmi < 40) {
      category = "Obese Class II";
      color = "text-red-600";
      emoji = "⚠️";
      description = "Your BMI indicates severe obesity.";
      healthAdvice = "Medical intervention is recommended. Consult a healthcare provider for a personalized treatment plan.";
    } else {
      category = "Obese Class III";
      color = "text-red-600";
      emoji = "⚠️";
      description = "Your BMI indicates very severe obesity.";
      healthAdvice = "Immediate medical consultation is strongly recommended. Your doctor can discuss treatment options including lifestyle changes and medical interventions.";
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            BMI Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Calculate your Body Mass Index • Enter in any unit - automatic conversion
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-4 sm:gap-6 items-start">
          {/* LEFT: Calculator */}
          <section>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200">
              <div className="space-y-6">
                {/* Weight Section */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Weight</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Kilograms (kg)
                      </label>
                      <input
                        type="number"
                        placeholder="70"
                        value={weightKg}
                        onChange={(e) => handleWeightKg(e.target.value)}
                        className="w-full px-3 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Pounds (lbs)
                      </label>
                      <input
                        type="number"
                        placeholder="154"
                        value={weightLbs}
                        onChange={(e) => handleWeightLbs(e.target.value)}
                        className="w-full px-3 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                  </div>
                </div>

                {/* Height Section */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Height</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Centimeters (cm)
                      </label>
                      <input
                        type="number"
                        placeholder="175"
                        value={heightCm}
                        onChange={(e) => handleHeightCm(e.target.value)}
                        className="w-full px-3 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">OR</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Feet
                        </label>
                        <input
                          type="number"
                          placeholder="5"
                          value={heightFt}
                          onChange={(e) => handleHeightFeet(e.target.value)}
                          className="w-full px-3 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Inches
                        </label>
                        <input
                          type="number"
                          placeholder="9"
                          value={heightIn}
                          onChange={(e) => handleHeightInches(e.target.value)}
                          className="w-full px-3 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BMI Info */}
              <div className="mt-5 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> Enter your measurements in any unit. The calculator automatically converts between metric and imperial.
                </p>
              </div>
            </div>

            {/* BMI Chart */}
            <div className="mt-4 bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">BMI Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-red-50 border border-red-200">
                  <span className="text-sm font-semibold text-gray-700">Severe Underweight</span>
                  <span className="text-sm font-bold text-red-600">&lt; 16</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-orange-50 border border-orange-200">
                  <span className="text-sm font-semibold text-gray-700">Underweight</span>
                  <span className="text-sm font-bold text-orange-600">16 - 18.5</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-green-50 border border-green-200">
                  <span className="text-sm font-semibold text-gray-700">Normal Weight</span>
                  <span className="text-sm font-bold text-green-600">18.5 - 25</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-orange-50 border border-orange-200">
                  <span className="text-sm font-semibold text-gray-700">Overweight</span>
                  <span className="text-sm font-bold text-orange-600">25 - 30</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-red-50 border border-red-200">
                  <span className="text-sm font-semibold text-gray-700">Obese</span>
                  <span className="text-sm font-bold text-red-600">&gt; 30</span>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: Result */}
          <aside className="lg:sticky lg:top-6">
            {hasResult ? (
              <>
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-200">
                  {/* BMI Value */}
                  <div className="text-center pb-4 mb-4 border-b border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Your BMI
                    </div>
                    <div className={`text-5xl sm:text-6xl font-bold ${color}`}>
                      {bmi.toFixed(1)}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                      <span className="text-2xl">{emoji}</span>
                      <span className={`font-bold text-lg ${color}`}>{category}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{description}</p>
                    <p className="text-sm text-gray-700">{healthAdvice}</p>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-gray-700">
                      <strong>Note:</strong> BMI is a screening tool and doesn't directly measure body fat. 
                      Athletes, pregnant women, and elderly may get inaccurate results. Always consult a healthcare 
                      professional for personalized health advice.
                    </p>
                  </div>
                </div>
                
                {/* Share Button */}
                <button
                  onClick={() => shareResults(bmi, category)}
                  className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  Share Result
                </button>
              </>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300 text-center">
                <div className="text-4xl mb-2">⚖️</div>
                <div className="text-gray-600 text-sm font-medium">
                  Enter your weight and height to calculate BMI
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* SEO Content */}
        <div className="mt-12 space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              What is BMI? Complete Guide to Body Mass Index
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              BMI (Body Mass Index) is a numerical value derived from your weight and height. It's used as a screening tool 
              to categorize individuals into different weight categories: underweight, normal weight, overweight, and obese. 
              BMI is calculated by dividing your weight in kilograms by the square of your height in meters (kg/m²), or for 
              imperial units, weight in pounds divided by height in inches squared, multiplied by 703.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Developed by Belgian mathematician Adolphe Quetelet in the 1830s, BMI has become a standard measure used by 
              healthcare professionals worldwide to assess whether a person has a healthy body weight for their height. 
              While BMI doesn't directly measure body fat, research has shown that it correlates with more direct measures 
              of body fat and can identify people at increased risk for health problems related to excess weight.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free BMI calculator makes it easy to calculate your Body Mass Index instantly. Simply enter your weight 
              and height in either metric or imperial units, and get immediate results showing your BMI value, category, 
              and personalized health recommendations. Whether you're tracking your fitness journey, monitoring your health, 
              or just curious about your BMI, this calculator provides accurate results in seconds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Calculate BMI: Formula and Examples
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">BMI Formula (Metric System)</h3>
                <div className="bg-indigo-50 p-4 rounded mb-2">
                  <p className="font-mono text-gray-900">BMI = Weight (kg) ÷ Height² (m²)</p>
                </div>
                <p className="text-gray-700 mb-2"><strong>Example:</strong></p>
                <p className="text-gray-700">Weight: 70 kg, Height: 1.75 m (175 cm)</p>
                <p className="text-gray-700">BMI = 70 ÷ (1.75 × 1.75) = 70 ÷ 3.0625 = <strong>22.9</strong></p>
                <p className="text-gray-700 mt-2 text-sm">This BMI of 22.9 falls in the "Normal Weight" category (18.5-25).</p>
              </div>

              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">BMI Formula (Imperial System)</h3>
                <div className="bg-indigo-50 p-4 rounded mb-2">
                  <p className="font-mono text-gray-900">BMI = (Weight (lbs) ÷ Height² (inches²)) × 703</p>
                </div>
                <p className="text-gray-700 mb-2"><strong>Example:</strong></p>
                <p className="text-gray-700">Weight: 154 lbs, Height: 5 feet 9 inches (69 inches)</p>
                <p className="text-gray-700">BMI = (154 ÷ (69 × 69)) × 703 = (154 ÷ 4761) × 703 = <strong>22.8</strong></p>
                <p className="text-gray-700 mt-2 text-sm">This BMI of 22.8 falls in the "Normal Weight" category.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              BMI Categories and What They Mean
            </h2>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">Severe Underweight (BMI &lt; 16)</h3>
                <p className="text-gray-700 text-sm mb-2">
                  A BMI under 16 indicates severe underweight, which can be a sign of malnutrition, eating disorders, 
                  or other serious health conditions. This requires immediate medical attention.
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Health Risks:</strong> Weakened immune system, osteoporosis, anemia, fertility issues, organ damage.
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <h3 className="font-bold text-orange-900 mb-2">Underweight (BMI 16 - 18.5)</h3>
                <p className="text-gray-700 text-sm mb-2">
                  A BMI between 16 and 18.5 indicates underweight. While not as critical as severe underweight, 
                  it may still pose health risks and should be addressed with a healthcare provider.
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Health Risks:</strong> Nutritional deficiencies, weakened immune function, decreased muscle mass, fatigue.
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-bold text-green-900 mb-2">Normal Weight (BMI 18.5 - 25)</h3>
                <p className="text-gray-700 text-sm mb-2">
                  A BMI between 18.5 and 25 is considered healthy and normal. People in this range typically have 
                  the lowest risk of weight-related health problems.
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Recommendation:</strong> Maintain current weight through balanced diet and regular physical activity.
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <h3 className="font-bold text-orange-900 mb-2">Overweight (BMI 25 - 30)</h3>
                <p className="text-gray-700 text-sm mb-2">
                  A BMI between 25 and 30 indicates overweight. This increases the risk of developing health problems, 
                  though the risk is generally lower than for obesity.
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Health Risks:</strong> Increased risk of high blood pressure, type 2 diabetes, heart disease, sleep apnea.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">Obese Class I (BMI 30 - 35)</h3>
                <p className="text-gray-700 text-sm mb-2">
                  A BMI between 30 and 35 indicates obesity. This significantly increases the risk of serious health conditions.
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Health Risks:</strong> Type 2 diabetes, high blood pressure, heart disease, stroke, certain cancers, osteoarthritis.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">Obese Class II (BMI 35 - 40)</h3>
                <p className="text-gray-700 text-sm mb-2">
                  A BMI between 35 and 40 indicates severe obesity with substantially increased health risks.
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Recommendation:</strong> Medical intervention and comprehensive weight management plan recommended.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">Obese Class III (BMI &gt; 40)</h3>
                <p className="text-gray-700 text-sm mb-2">
                  A BMI over 40 indicates very severe (morbid) obesity with extremely high health risks.
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Recommendation:</strong> Immediate medical consultation strongly recommended. Treatment may include lifestyle changes, medication, or bariatric surgery.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Limitations of BMI: What BMI Doesn't Tell You
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              While BMI is a useful screening tool, it has important limitations that you should be aware of:
            </p>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Doesn't Measure Body Fat Directly</h3>
                <p className="text-gray-700 text-sm">
                  BMI only uses height and weight, so it can't distinguish between muscle mass and fat mass. 
                  A muscular athlete might have a high BMI but low body fat.
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Doesn't Account for Fat Distribution</h3>
                <p className="text-gray-700 text-sm">
                  BMI doesn't show where fat is stored. Abdominal fat (visceral fat) is more dangerous than 
                  fat stored in hips or thighs, but BMI treats them the same.
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">May Not Apply to All Populations</h3>
                <p className="text-gray-700 text-sm">
                  BMI standards were developed primarily using Caucasian populations. Different ethnic groups 
                  may have different body compositions at the same BMI. Asian populations, for example, may 
                  have higher health risks at lower BMI values.
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Age and Gender Differences</h3>
                <p className="text-gray-700 text-sm">
                  BMI doesn't account for age or gender. Older adults naturally have more body fat, and women 
                  typically have more body fat than men at the same BMI.
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Not Suitable for Certain Groups</h3>
                <p className="text-gray-700 text-sm">
                  BMI is not accurate for: pregnant or breastfeeding women, competitive athletes and bodybuilders, 
                  children and teenagers (use age and sex-specific BMI percentiles instead), elderly individuals, 
                  people with certain medical conditions affecting weight.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Achieve and Maintain a Healthy BMI
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Healthy Eating Habits</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Eat plenty of fruits and vegetables (5+ servings daily)</li>
                  <li>• Choose whole grains over refined grains</li>
                  <li>• Include lean proteins (fish, poultry, beans, nuts)</li>
                  <li>• Limit saturated fats, added sugars, and sodium</li>
                  <li>• Control portion sizes</li>
                  <li>• Stay hydrated with water</li>
                  <li>• Limit processed and fast foods</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Physical Activity</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Aim for 150 minutes of moderate aerobic activity weekly</li>
                  <li>• Include strength training 2+ times per week</li>
                  <li>• Start slowly and gradually increase intensity</li>
                  <li>• Find activities you enjoy to stay motivated</li>
                  <li>• Take the stairs, walk more, stay active throughout the day</li>
                  <li>• Mix cardio, strength, and flexibility exercises</li>
                  <li>• Get adequate sleep (7-9 hours for adults)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions About BMI
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What is a healthy BMI?</h3>
                <p className="text-gray-700">A healthy BMI is between 18.5 and 25. This range is associated with the lowest risk of weight-related health problems for most adults.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How accurate is BMI?</h3>
                <p className="text-gray-700">BMI is a useful screening tool but not a diagnostic measure. It doesn't directly measure body fat and may not be accurate for athletes, elderly, pregnant women, or certain ethnic groups. Use it as one indicator alongside other health measures.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Is BMI different for men and women?</h3>
                <p className="text-gray-700">The BMI formula and categories are the same for adult men and women. However, women typically have more body fat than men at the same BMI. Some health professionals consider this when evaluating health risks.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can BMI be used for children?</h3>
                <p className="text-gray-700">BMI can be used for children aged 2-19, but it's interpreted differently using age and sex-specific percentile charts. Children's BMI changes as they grow, so percentiles are used instead of fixed categories.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What BMI is considered obese?</h3>
                <p className="text-gray-700">A BMI of 30 or higher is classified as obese. This is further divided into Class I (30-35), Class II (35-40), and Class III (over 40) obesity, with increasing health risks at higher levels.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Does muscle mass affect BMI?</h3>
                <p className="text-gray-700">Yes. Since muscle weighs more than fat, very muscular people (like athletes and bodybuilders) may have a high BMI despite having low body fat. BMI doesn't distinguish between muscle and fat mass.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How often should I check my BMI?</h3>
                <p className="text-gray-700">Check your BMI monthly or quarterly if you're actively working on weight management. For general health monitoring, checking once or twice a year is sufficient for most people.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Is BMI the same worldwide?</h3>
                <p className="text-gray-700">The BMI calculation is universal, but some countries use different category cutoffs. For example, Asian countries often use lower thresholds (overweight at 23, obese at 27.5) due to higher health risks at lower BMI values in Asian populations.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What if my BMI is on the border between categories?</h3>
                <p className="text-gray-700">BMI categories are guidelines, not absolute thresholds. If you're on a border (like 24.9 or 25.1), your health risk is similar. Focus on overall health indicators like waist circumference, blood pressure, cholesterol, and fitness level.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can I use BMI if I'm pregnant?</h3>
                <p className="text-gray-700">No, BMI is not accurate during pregnancy due to natural weight gain. Your healthcare provider will monitor your weight gain based on your pre-pregnancy BMI and recommend appropriate ranges for healthy pregnancy.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}