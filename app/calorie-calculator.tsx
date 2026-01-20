"use client";

import { useState } from "react";

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [weightKg, setWeightKg] = useState("");
  const [weightLb, setWeightLb] = useState("");
  const [targetWeightKg, setTargetWeightKg] = useState("");
  const [targetWeightLb, setTargetWeightLb] = useState("");
  const [activityLevel, setActivityLevel] = useState("1.375");
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("maintain");

  const getHeightInCm = () => {
    if (heightUnit === "cm") {
      return Number(heightCm) || 0;
    } else {
      const ft = Number(heightFt) || 0;
      const inches = Number(heightIn) || 0;
      return (ft * 30.48) + (inches * 2.54);
    }
  };

  const getWeightInKg = () => {
    if (weightUnit === "kg") {
      return Number(weightKg) || 0;
    } else {
      return (Number(weightLb) || 0) * 0.453592;
    }
  };

  const handleHeightCmChange = (value: string) => {
    setHeightCm(value);
    const cm = Number(value) || 0;
    const totalInches = cm / 2.54;
    setHeightFt(Math.floor(totalInches / 12).toString());
    setHeightIn(Math.round(totalInches % 12).toString());
  };

  const handleHeightFtInChange = (ft: string, inches: string) => {
    setHeightFt(ft);
    setHeightIn(inches);
    const totalCm = (Number(ft) || 0) * 30.48 + (Number(inches) || 0) * 2.54;
    setHeightCm(Math.round(totalCm).toString());
  };

  const handleWeightKgChange = (value: string) => {
    setWeightKg(value);
    setWeightLb(Math.round((Number(value) || 0) * 2.20462).toString());
  };

  const handleWeightLbChange = (value: string) => {
    setWeightLb(value);
    setWeightKg(Math.round((Number(value) || 0) * 0.453592).toString());
  };

  const handleTargetWeightKgChange = (value: string) => {
    setTargetWeightKg(value);
    setTargetWeightLb(Math.round((Number(value) || 0) * 2.20462).toString());
  };

  const handleTargetWeightLbChange = (value: string) => {
    setTargetWeightLb(value);
    setTargetWeightKg(Math.round((Number(value) || 0) * 0.453592).toString());
  };

  const calculateBMR = () => {
    const weight = getWeightInKg();
    const height = getHeightInCm();
    const ageNum = Number(age) || 0;

    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * ageNum + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * ageNum - 161;
    }
  };

  const bmr = calculateBMR();
  const maintenanceCalories = bmr * Number(activityLevel);
  const goalAdjustment = goal === "lose" ? -500 : goal === "gain" ? 300 : 0;
  const dailyCalories = maintenanceCalories + goalAdjustment;
  const proteinGrams = Math.round(getWeightInKg() * 1.6);
  const weeklyCalorieDiff = goalAdjustment * 7;
  const weeklyWeightChange = weeklyCalorieDiff / 7700;

  const currentWeight = getWeightInKg();
  const targetWeight = weightUnit === "kg" ? Number(targetWeightKg) || 0 : Number(targetWeightLb) * 0.453592 || 0;
  const weightDifference = targetWeight - currentWeight;
 const hasTargetWeight =
  targetWeight > 0 && currentWeight > 0 && goal !== "maintain";

const isTargetInvalid =
  hasTargetWeight &&
  ((goal === "lose" && targetWeight >= currentWeight) ||
    (goal === "gain" && targetWeight <= currentWeight));

const validTargetWeight = hasTargetWeight && !isTargetInvalid;

const weeksToTarget =
  validTargetWeight && weeklyWeightChange !== 0
    ? Math.abs(weightDifference / weeklyWeightChange)
    : 0;

  const proteinCalories = proteinGrams * 4;
  const fatCalories = dailyCalories * 0.30;
  const carbCalories = dailyCalories - proteinCalories - fatCalories;
  const fatGrams = Math.round(fatCalories / 9);
  const carbGrams = Math.round(carbCalories / 4);

  const hasInput = age && (heightCm || (heightFt && heightIn)) && (weightKg || weightLb);

  function shareResults() {
    const text = `My Calorie Plan:
Daily Target: ${Math.round(dailyCalories)} kcal
Maintenance: ${Math.round(maintenanceCalories)} kcal
Goal: ${goal.charAt(0).toUpperCase() + goal.slice(1)} weight

Macros:
Protein: ${proteinGrams}g
Carbs: ${carbGrams}g
Fat: ${fatGrams}g

Activity: ${activityLevel === "1.2" ? "Sedentary" : activityLevel === "1.375" ? "Light" : activityLevel === "1.55" ? "Moderate" : "Very Active"}`;

    if (navigator.share) {
      navigator.share({ title: "Calorie Plan", text })
        .catch((error) => {
          if (error.name !== 'AbortError') console.error('Share failed:', error);
        });
    } else {
      navigator.clipboard.writeText(text);
      alert("📋 Copied to clipboard!");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <header className="mb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Daily Calorie Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Calculate your daily calorie needs and macro targets for your fitness goals
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-4 sm:gap-6 items-start">
          <section className="space-y-4">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGender("male")}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                        gender === "male"
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      👨 Male
                    </button>
                    <button
                      onClick={() => setGender("female")}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                        gender === "female"
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      👩 Female
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="13"
                    max="90"
                    placeholder="25"
                    className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">Height</label>
                    <div className="flex gap-1 bg-gray-200 rounded-lg p-1">
                      <button
                        onClick={() => setHeightUnit("cm")}
                        className={`px-3 py-1 text-xs rounded font-semibold transition-all ${
                          heightUnit === "cm"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600"
                        }`}
                      >
                        cm
                      </button>
                      <button
                        onClick={() => setHeightUnit("ft")}
                        className={`px-3 py-1 text-xs rounded font-semibold transition-all ${
                          heightUnit === "ft"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600"
                        }`}
                      >
                        ft/in
                      </button>
                    </div>
                  </div>

                  {heightUnit === "cm" ? (
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => handleHeightCmChange(e.target.value)}
                      min="100"
                      max="250"
                      placeholder="170"
                      className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={heightFt}
                          onChange={(e) => handleHeightFtInChange(e.target.value, heightIn)}
                          min="3"
                          max="8"
                          placeholder="5"
                          className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                        />
                        <span className="text-xs text-gray-500 mt-1 block text-center">feet</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={heightIn}
                          onChange={(e) => handleHeightFtInChange(heightFt, e.target.value)}
                          min="0"
                          max="11"
                          placeholder="7"
                          className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                        />
                        <span className="text-xs text-gray-500 mt-1 block text-center">inches</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">Current Weight</label>
                    <div className="flex gap-1 bg-gray-200 rounded-lg p-1">
                      <button
                        onClick={() => setWeightUnit("kg")}
                        className={`px-3 py-1 text-xs rounded font-semibold transition-all ${
                          weightUnit === "kg"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600"
                        }`}
                      >
                        kg
                      </button>
                      <button
                        onClick={() => setWeightUnit("lb")}
                        className={`px-3 py-1 text-xs rounded font-semibold transition-all ${
                          weightUnit === "lb"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600"
                        }`}
                      >
                        lb
                      </button>
                    </div>
                  </div>

                  {weightUnit === "kg" ? (
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => handleWeightKgChange(e.target.value)}
                      min="30"
                      max="300"
                      placeholder="70"
                      className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  ) : (
                    <input
                      type="number"
                      value={weightLb}
                      onChange={(e) => handleWeightLbChange(e.target.value)}
                      min="66"
                      max="660"
                      placeholder="154"
                      className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  )}
                </div>

              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Activity & Goals</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Level</label>
                  <div className="space-y-2">
                    {[
                      { value: "1.2", label: "Sedentary", desc: "Little to no exercise" },
                      { value: "1.375", label: "Light", desc: "Exercise 1-3 days/week" },
                      { value: "1.55", label: "Moderate", desc: "Exercise 3-5 days/week" },
                      { value: "1.725", label: "Very Active", desc: "Exercise 6-7 days/week" },
                    ].map((activity) => (
                      <button
                        key={activity.value}
                        onClick={() => setActivityLevel(activity.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all border-2 ${
                          activityLevel === activity.value
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-semibold text-gray-900 text-sm">{activity.label}</div>
                        <div className="text-xs text-gray-600">{activity.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Goal</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setGoal("lose")}
                      className={`py-3 px-3 rounded-lg font-semibold text-sm transition-all ${
                        goal === "lose"
                          ? "bg-red-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <div className="text-lg mb-1">📉</div>
                      Lose
                    </button>
                    <button
                      onClick={() => setGoal("maintain")}
                      className={`py-3 px-3 rounded-lg font-semibold text-sm transition-all ${
                        goal === "maintain"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <div className="text-lg mb-1">➡️</div>
                      Maintain
                    </button>
                    <button
                      onClick={() => setGoal("gain")}
                      className={`py-3 px-3 rounded-lg font-semibold text-sm transition-all ${
                        goal === "gain"
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <div className="text-lg mb-1">📈</div>
                      Gain
                    </button>
                  </div>
                </div>

                {goal !== "maintain" && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Target Weight (Optional)</label>
                    {weightUnit === "kg" ? (
                      <input
                        type="number"
                        value={targetWeightKg}
                        onChange={(e) => handleTargetWeightKgChange(e.target.value)}
                        min="30"
                        max="300"
                        placeholder="65"
                        className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                    ) : (
                      <input
                        type="number"
                        value={targetWeightLb}
                        onChange={(e) => handleTargetWeightLbChange(e.target.value)}
                        min="66"
                        max="660"
                        placeholder="143"
                        className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                    )}
                    <p className="text-xs text-gray-500 mt-1">See estimated time to reach your goal</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-6">
            {hasInput ? (
              <>
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Daily Calorie Target
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-1">
                    {Math.round(dailyCalories)}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">kcal/day</div>

                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Maintenance</span>
                      <span className="font-semibold text-gray-900">{Math.round(maintenanceCalories)} kcal</span>
                    </div>
                    {goal !== "maintain" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Weekly Change</span>
                        <span className={`font-semibold ${weeklyWeightChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {weeklyWeightChange > 0 ? '+' : ''}{Math.abs(weeklyWeightChange).toFixed(2)} kg
                        </span>
                      </div>
                    )}
                    {validTargetWeight && (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">Time to Target</span>
    <span className="font-semibold text-indigo-600">
      {Math.ceil(weeksToTarget)} weeks
      {weeksToTarget > 4 ? ` (~${Math.round(weeksToTarget / 4)} months)` : ""}
    </span>
  </div>
)}

{isTargetInvalid && (
  <div className="text-xs text-red-600 mt-2 font-semibold">
    Target weight must be {goal === "lose" ? "lower" : "higher"} than your current weight.
  </div>
)}
                  </div>

                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Macro Breakdown</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-900">Protein</span>
                        <span className="text-lg font-bold text-blue-600">{proteinGrams}g</span>
                      </div>
                      <div className="text-xs text-gray-600">{Math.round(proteinCalories)} kcal ({Math.round(proteinCalories/dailyCalories*100)}%)</div>
                    </div>

                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-900">Carbs</span>
                        <span className="text-lg font-bold text-orange-600">{carbGrams}g</span>
                      </div>
                      <div className="text-xs text-gray-600">{Math.round(carbCalories)} kcal ({Math.round(carbCalories/dailyCalories*100)}%)</div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-900">Fat</span>
                        <span className="text-lg font-bold text-yellow-600">{fatGrams}g</span>
                      </div>
                      <div className="text-xs text-gray-600">{Math.round(fatCalories)} kcal ({Math.round(fatCalories/dailyCalories*100)}%)</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                    <div className="font-semibold text-gray-900 mb-1">💡 Quick Tips</div>
                    {goal === "lose" && "Track your calories and maintain a small deficit for sustainable weight loss."}
                    {goal === "maintain" && "Focus on balanced nutrition and consistent activity levels."}
                    {goal === "gain" && "Eat in a slight surplus and focus on strength training for muscle growth."}
                  </div>

                  <div className="mt-3 bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs text-gray-700">
                    <div className="font-semibold text-yellow-900 mb-1">⚠️ Medical Disclaimer</div>
                    <p>This calculator provides estimates for educational purposes only. Results are not medical advice. Consult a healthcare professional or registered dietitian before making significant dietary changes, especially if you have medical conditions, are pregnant, nursing, or under 18.</p>
                  </div>
                </div>

                <button
                  onClick={shareResults}
                  className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  Share Plan
                </button>
              </>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300 text-center">
                <div className="text-4xl mb-2">🍎</div>
                <div className="text-gray-600 text-sm font-medium">
                  Enter your details to calculate
                </div>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-12 space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Calculate Your Daily Calorie Needs
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              This free calorie calculator determines your Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation, the most accurate formula for calculating Basal Metabolic Rate (BMR). Your BMR represents the calories your body burns at rest, while TDEE accounts for your activity level to show total daily calorie needs. Whether your goal is weight loss, muscle gain, or weight maintenance, this calculator provides personalized calorie targets and macro breakdowns.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The calculator uses scientifically validated formulas: for men, BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5, and for women, BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161. Your TDEE is then calculated by multiplying BMR by your activity factor, ranging from 1.2 for sedentary individuals to 1.725 for very active people who exercise 6-7 days per week.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Understanding Your Calorie Results
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Your daily calorie target adjusts based on your weight goals. For weight loss, the calculator creates a 500-calorie deficit, which typically results in losing approximately 0.5 kg (1 pound) per week. For muscle gain, it adds 300 calories above maintenance to support gradual, lean muscle growth. Maintenance calories keep your weight stable while providing adequate energy for daily activities and exercise.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The macro breakdown shows recommended protein (1.6g per kg of body weight for muscle preservation), along with balanced carbohydrates and fats. Protein is calculated at 4 calories per gram, fats at 9 calories per gram, and carbohydrates at 4 calories per gram. This balanced approach ensures you meet nutritional needs while working toward your fitness goals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Activity Level Guide for Accurate Results
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-1">Sedentary (1.2x multiplier)</h3>
                <p className="text-gray-700 text-sm">Little to no exercise, desk job, minimal daily movement. This represents office workers or individuals with limited physical activity throughout the day.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-1">Light Activity (1.375x multiplier)</h3>
                <p className="text-gray-700 text-sm">Exercise or light sports 1-3 days per week. Walking regularly, light jogging, or casual recreational activities qualify as light activity level.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-1">Moderate Activity (1.55x multiplier)</h3>
                <p className="text-gray-700 text-sm">Exercise or moderate sports 3-5 days per week. Regular gym sessions, running, cycling, or active job roles fit this category.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-1">Very Active (1.725x multiplier)</h3>
                <p className="text-gray-700 text-sm">Hard exercise or sports 6-7 days per week. Athletes, construction workers, or individuals with intense daily training programs should select this level.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Use This Calorie Calculator
            </h2>
            <div className="space-y-3">
              <div className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Step 1: Enter Basic Information</h3>
                <p className="text-gray-700 text-sm">Select your gender and enter your age (13-90 years). Gender affects BMR calculation due to different muscle mass and metabolic rates between males and females.</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Step 2: Input Height and Weight</h3>
                <p className="text-gray-700 text-sm">Enter height in centimeters or feet/inches, and weight in kilograms or pounds. The calculator automatically converts between units for your convenience.</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Step 3: Choose Activity Level</h3>
                <p className="text-gray-700 text-sm">Select the activity level that best matches your weekly exercise routine and daily physical activity. Be honest for accurate results.</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Step 4: Select Your Goal</h3>
                <p className="text-gray-700 text-sm">Choose whether you want to lose weight (500 calorie deficit), maintain current weight, or gain muscle (300 calorie surplus).</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Step 5: View Your Results</h3>
                <p className="text-gray-700 text-sm">See your daily calorie target, maintenance calories, weekly weight change estimate, and complete macronutrient breakdown in real-time.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Important Health & Safety Information
            </h2>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
              <h3 className="font-bold text-yellow-900 mb-3 text-lg">Medical Disclaimer</h3>
              <p className="text-gray-800 leading-relaxed mb-3">
                This calorie calculator is provided for informational and educational purposes only. The results are estimates based on general formulas and should not be considered medical advice, diagnosis, or treatment recommendations. Individual calorie needs can vary significantly based on genetics, metabolism, medical conditions, medications, and other factors not captured by this calculator.
              </p>
              <p className="text-gray-800 leading-relaxed mb-3">
                Before making any significant changes to your diet, exercise routine, or weight management plan, consult with a qualified healthcare provider, registered dietitian, or certified nutritionist. This is especially important if you have pre-existing medical conditions (diabetes, heart disease, thyroid disorders, eating disorders), are pregnant or nursing, are under 18 years old, or are taking medications that may affect metabolism or weight.
              </p>
              <p className="text-gray-800 leading-relaxed mb-3">
                Very low calorie diets (below 1200 calories for women or 1500 for men) can be dangerous without medical supervision and may lead to nutrient deficiencies, muscle loss, metabolic slowdown, and other health complications. If this calculator suggests calorie levels that seem unusually low or high for you, please consult a healthcare professional before following those recommendations.
              </p>
              <p className="text-gray-800 leading-relaxed">
                The creators and operators of this calculator assume no responsibility for any health outcomes resulting from the use of this tool. Weight loss and fitness results vary by individual. Past performance and calculator estimates do not guarantee future results. Always prioritize your health and safety above calculator outputs.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}