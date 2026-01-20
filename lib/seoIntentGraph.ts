// File: /src/lib/seoIntentGraph.ts

export interface SEOPageData {
  href: string;
  category: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  intents: string[];
  faqs: Array<{
    q: string;
    a: string;
  }>;
}

export const seoIntentGraph: readonly SEOPageData[] = [
  {
    href: "/discount",
    category: "Shopping & Savings",
    title: "Discount Calculator – Save Money on Sales & Shopping",
    metaDescription: "Calculate final prices and total savings for multiple products during sales. Free discount calculator for Black Friday, Cyber Monday, and year-round shopping deals.",
    h1: "Discount Calculator",
    intro: "Calculate how much you'll save on multiple products during sales, including Black Friday and Cyber Monday. See exact final prices and total savings instantly.",
    keywords: ["discount calculator", "sale savings calculator", "price discount calculator", "shopping discount", "percentage off calculator", "final price calculator"],
    intents: [
      "how much will I save on sale",
      "discount calculation online",
      "final price after discount",
      "multi-product discount calculator",
      "calculate sale savings"
    ],
    faqs: [
      { 
        q: "Can I calculate discounts for multiple products at once?", 
        a: "Yes, our calculator supports multiple items. Enter each product's original price and discount percentage to see total savings across all purchases." 
      },
      { 
        q: "How does the percentage discount calculator work?", 
        a: "Enter the original price and discount percentage (like 20% off), and the calculator automatically shows the final price and amount saved." 
      },
      {
        q: "Can I use this for Black Friday and Cyber Monday shopping?",
        a: "Yes, this calculator is perfect for comparing deals during major sales events. Add multiple items to see your total savings."
      }
    ]
  },
  {
    href: "/percentage",
    category: "Shopping & Savings",
    title: "Percentage Calculator – Calculate Percent Increase, Decrease & More",
    metaDescription: "Free percentage calculator for increases, decreases, ratios, and comparisons. Perfect for shopping discounts, financial calculations, and academic use.",
    h1: "Percentage Calculator",
    intro: "Solve any percentage problem including increases, decreases, and ratios. Use for shopping discounts, tax calculations, grade percentages, and financial planning.",
    keywords: ["percentage calculator", "percent increase calculator", "percent decrease calculator", "ratio to percentage", "percentage change calculator"],
    intents: [
      "calculate percentage",
      "percentage increase calculator",
      "percentage decrease calculator",
      "convert ratio to percent",
      "percentage difference calculator"
    ],
    faqs: [
      { 
        q: "Can this calculator handle percentage increases and decreases?", 
        a: "Yes, it calculates both increases (like price hikes) and decreases (like discounts) with exact percentage changes." 
      },
      { 
        q: "Is it suitable for financial calculations?", 
        a: "Yes, you can calculate discounts, interest rates, tax percentages, investment returns, and price changes accurately." 
      },
      {
        q: "How do I calculate what percentage one number is of another?",
        a: "Enter both numbers and the calculator will show what percentage the first number represents of the second number."
      }
    ]
  },
  {
    href: "/tip",
    category: "Dining & Lifestyle",
    title: "Tip Calculator – Calculate Tips & Split Restaurant Bills",
    metaDescription: "Free tip calculator with bill splitting for restaurants and services. Calculate 15%, 18%, 20% tips or custom amounts and divide among multiple people.",
    h1: "Tip Calculator",
    intro: "Calculate tips for restaurants, delivery services, and any tipping situation. Supports custom percentages and automatic bill splitting for groups.",
    keywords: ["tip calculator", "restaurant tip calculator", "split bill calculator", "gratuity calculator", "tip percentage calculator", "group tip calculator"],
    intents: [
      "calculate restaurant tip",
      "split bill among friends",
      "custom tip percentage calculator",
      "tip calculator with split",
      "how much to tip"
    ],
    faqs: [
      { 
        q: "Can I split the tip and bill among multiple people?", 
        a: "Yes, enter the number of people and the calculator automatically divides the total bill and tip equally among everyone." 
      },
      { 
        q: "What tip percentages are standard?", 
        a: "Common tip percentages are 15% for adequate service, 18% for good service, and 20% or more for excellent service. You can also enter custom percentages." 
      },
      {
        q: "Does it work for delivery and takeout orders?",
        a: "Yes, you can use this calculator for any service that accepts tips including delivery, takeout, hair salons, and taxis."
      }
    ]
  },
  {
    href: "/bill-split",
    category: "Dining & Lifestyle",
    title: "Bill Splitter – Fairly Divide Restaurant Bills & Group Expenses",
    metaDescription: "Advanced bill splitter for restaurants with individual item tracking, shared dishes, proportional tax, and tip allocation. Split group expenses fairly.",
    h1: "Bill Splitter",
    intro: "Track individual orders, share appetizers and desserts, calculate proportional tax distribution, and split tips accurately for every group member.",
    keywords: ["bill splitter", "split restaurant check", "group expense calculator", "fair bill division", "shared meal calculator", "itemized bill split"],
    intents: [
      "split restaurant bill fairly",
      "divide group dinner bill",
      "shared meal cost calculator",
      "itemized bill splitting",
      "calculate individual share"
    ],
    faqs: [
      { 
        q: "Can I track what each person ordered individually?", 
        a: "Yes, you can enter each person's items separately, plus shared dishes like appetizers or desserts that are split among the group." 
      },
      { 
        q: "How does it handle tax and tip?", 
        a: "The calculator allocates tax and tip proportionally based on what each person ordered, ensuring fair distribution." 
      },
      {
        q: "What if some items are shared?",
        a: "You can mark items as shared and specify how many people split them. The cost is divided equally among those people."
      }
    ]
  },
  {
    href: "/bmi",
    category: "Health & Fitness",
    title: "BMI Calculator – Check Your Body Mass Index & Healthy Weight",
    metaDescription: "Free BMI calculator to check if you're underweight, normal weight, overweight, or obese. Supports metric (kg/cm) and imperial (lbs/ft) units following WHO standards.",
    h1: "BMI Calculator",
    intro: "Calculate your Body Mass Index (BMI) to understand your weight status. Get your healthy weight range based on height and see if you're underweight, normal, overweight, or obese according to WHO standards.",
    keywords: ["BMI calculator", "body mass index calculator", "healthy weight calculator", "weight assessment tool", "BMI chart", "check BMI"],
    intents: [
      "calculate my BMI",
      "check healthy weight range",
      "BMI calculator for adults",
      "body mass index categories",
      "am I overweight calculator"
    ],
    faqs: [
      { 
        q: "Does the BMI calculator support both metric and imperial units?", 
        a: "Yes, you can enter height in centimeters or feet/inches, and weight in kilograms or pounds. The calculator converts and computes BMI automatically." 
      },
      { 
        q: "What do the BMI categories mean?", 
        a: "BMI categories follow WHO standards: Underweight (below 18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (30+). These help assess health risks related to weight." 
      },
      {
        q: "Is BMI accurate for everyone?",
        a: "BMI is a useful screening tool for most adults but doesn't account for muscle mass, bone density, or body composition. Athletes and very muscular individuals may have high BMI despite being healthy."
      }
    ]
  },
  {
    href: "/calorie",
    category: "Health & Fitness",
    title: "Calorie Calculator – Daily Caloric Needs & Macro Calculator",
    metaDescription: "Calculate daily calorie requirements and macronutrient targets (protein, carbs, fats) for weight loss, maintenance, or muscle gain using the Mifflin-St Jeor equation.",
    h1: "Calorie Calculator",
    intro: "Determine your daily caloric needs and macronutrient breakdown for weight loss, maintenance, or muscle gain. Uses the scientifically validated Mifflin-St Jeor equation for accurate results.",
    keywords: ["calorie calculator", "daily calorie needs", "TDEE calculator", "BMR calculator", "macro calculator", "nutrition calculator", "diet calculator"],
    intents: [
      "calculate daily calories",
      "how many calories should I eat",
      "macronutrient calculator",
      "BMR calculation",
      "TDEE for weight loss"
    ],
    faqs: [
      { 
        q: "What is the difference between BMR and TDEE?", 
        a: "BMR (Basal Metabolic Rate) is calories burned at rest. TDEE (Total Daily Energy Expenditure) includes BMR plus calories burned through activity. This calculator provides both." 
      },
      { 
        q: "Does it calculate protein, carb, and fat requirements?", 
        a: "Yes, based on your goal (weight loss, maintenance, or muscle gain), it calculates recommended grams of protein, carbohydrates, and fats per day." 
      },
      {
        q: "How accurate is the calorie calculation?",
        a: "We use the Mifflin-St Jeor equation, which research shows is one of the most accurate formulas for predicting metabolic rate for the general population."
      }
    ]
  },
  {
    href: "/gpa",
    category: "Education & Academic",
    title: "GPA Calculator – Calculate GPA for US, UK, Indian & International Systems",
    metaDescription: "Free GPA calculator supporting 10+ grading systems including US 4.0 scale, Indian CGPA, UK degree classifications, German grades. Track semester and cumulative GPA.",
    h1: "GPA Calculator",
    intro: "Calculate your GPA using US 4.0 scale, Indian 10-point CGPA, UK degree classifications, German grading system, and 10+ international standards. Track semester performance and cumulative GPA.",
    keywords: ["GPA calculator", "CGPA calculator", "grade point average", "academic GPA", "semester GPA", "cumulative GPA", "international grading system"],
    intents: [
      "calculate my GPA",
      "CGPA to GPA conversion",
      "semester GPA calculator",
      "target GPA calculator",
      "international GPA calculator"
    ],
    faqs: [
      { 
        q: "Can I calculate my target GPA for future semesters?", 
        a: "Yes, enter your current GPA and credit hours, then specify your desired final GPA. The calculator shows what grades you need in remaining courses." 
      },
      { 
        q: "What grading systems are supported?", 
        a: "We support US 4.0 scale, Indian 10-point CGPA, UK degree classifications (First Class, Upper Second, etc.), German 1-5 system, Australian GPA, Canadian percentage, and more." 
      },
      {
        q: "Can I calculate cumulative GPA across multiple semesters?",
        a: "Yes, enter grades and credits for each semester to calculate your overall cumulative GPA across all terms."
      }
    ]
  },
  {
    href: "/age",
    category: "Education & Academic",
    title: "Age Calculator – Exact Age, Birthday Countdown & Zodiac Signs",
    metaDescription: "Calculate exact age in years, months, days with live countdown to next birthday. Includes Western and Chinese zodiac signs, day born, and planetary ages.",
    h1: "Age Calculator",
    intro: "Discover your exact age in years, months, and days with real-time updates. See your next birthday countdown, Western and Chinese zodiac signs, day of week you were born, and your age on other planets.",
    keywords: ["age calculator", "exact age calculator", "birthday countdown", "zodiac calculator", "planetary age", "age in days", "Chinese zodiac"],
    intents: [
      "calculate my exact age",
      "birthday countdown calculator",
      "what zodiac sign am I",
      "age on Mars calculator",
      "how old am I in days"
    ],
    faqs: [
      { 
        q: "Does it show both Western and Chinese zodiac signs?", 
        a: "Yes, the calculator displays your Western zodiac sign (Aries, Taurus, etc.) and Chinese zodiac animal (Rat, Ox, Tiger, etc.) based on your birth date." 
      },
      { 
        q: "Can I see my age in different units?", 
        a: "Yes, it shows your age in years/months/days, total days lived, total hours, total minutes, and total seconds with live updates." 
      },
      {
        q: "What are planetary ages?",
        a: "Planetary ages show how old you'd be on other planets based on their orbital periods. For example, you'd be much younger on Jupiter since it takes 12 Earth years to orbit the sun."
      }
    ]
  },
  {
    href: "/loan",
    category: "Finance & Loans",
    title: "Loan EMI Calculator – Home, Car & Personal Loan EMI",
    metaDescription: "Calculate EMI for home loans, car loans, personal loans with detailed amortization schedules. See monthly principal and interest breakdown for any loan term.",
    h1: "Loan EMI Calculator",
    intro: "Calculate your Equated Monthly Installment (EMI) for home loans, car loans, personal loans, and education loans. Get detailed amortization schedules showing principal and interest breakdown.",
    keywords: ["loan EMI calculator", "home loan EMI", "car loan EMI", "personal loan calculator", "EMI calculation", "loan repayment schedule"],
    intents: [
      "calculate loan EMI",
      "home loan EMI calculator",
      "car loan monthly payment",
      "personal loan EMI",
      "loan amortization schedule"
    ],
    faqs: [
      { 
        q: "Does it show monthly principal and interest breakdown?", 
        a: "Yes, the calculator provides a complete amortization schedule showing how much of each EMI goes toward principal versus interest every month." 
      },
      { 
        q: "Can I calculate EMI for different loan terms?", 
        a: "Yes, you can calculate EMI for any loan duration including common terms like 1 year, 3 years, 5 years, 10 years, 15 years, 20 years, or 30 years." 
      },
      {
        q: "How is EMI calculated?",
        a: "EMI is calculated using the formula: [P x R x (1+R)^N]/[(1+R)^N-1], where P is loan amount, R is monthly interest rate, and N is number of months."
      }
    ]
  },
  {
    href: "/mortgage",
    category: "Finance & Loans",
    title: "Mortgage Calculator – Monthly Payment with Taxes, Insurance & PMI",
    metaDescription: "Calculate monthly mortgage payments including principal, interest, property taxes, homeowner's insurance, and PMI. Compare 15-year vs 30-year mortgages with amortization schedules.",
    h1: "Mortgage Calculator",
    intro: "Estimate your monthly mortgage payment including principal, interest, property taxes, homeowner's insurance, and PMI. Compare different loan terms and see complete amortization schedules.",
    keywords: ["mortgage calculator", "home loan payment calculator", "monthly mortgage payment", "mortgage with PMI", "property tax calculator", "15 vs 30 year mortgage"],
    intents: [
      "calculate mortgage payment",
      "home loan monthly payment",
      "compare 15 vs 30 year mortgage",
      "mortgage calculator with taxes",
      "calculate PMI payment"
    ],
    faqs: [
      { 
        q: "What is PMI and when do I need it?", 
        a: "Private Mortgage Insurance (PMI) protects the lender if you default. It's required when your down payment is less than 20% of the home's value." 
      },
      { 
        q: "Should I choose a 15-year or 30-year mortgage?", 
        a: "15-year mortgages have higher monthly payments but lower total interest. 30-year mortgages have lower monthly payments but higher total interest. Use the calculator to compare both options." 
      },
      {
        q: "Are property taxes and insurance included in the calculation?",
        a: "Yes, you can enter annual property tax and homeowner's insurance amounts. The calculator divides them by 12 and adds them to your monthly payment (PITI - Principal, Interest, Taxes, Insurance)."
      }
    ]
  }
] as const;

// Validation function to ensure data integrity
export function validateSEOIntentGraph(): void {
  const errors: string[] = [];
  const seenHrefs = new Set<string>();

  seoIntentGraph.forEach((item, index) => {
    // Check for duplicate hrefs
    if (seenHrefs.has(item.href)) {
      errors.push(`Duplicate href found: ${item.href}`);
    }
    seenHrefs.add(item.href);

    // Validate required fields
    if (!item.href.startsWith('/')) {
      errors.push(`Invalid href at index ${index}: ${item.href} (must start with /)`);
    }
    if (!item.title || item.title.length < 10) {
      errors.push(`Invalid title at index ${index}: ${item.href}`);
    }
    if (!item.metaDescription || item.metaDescription.length < 50) {
      errors.push(`Invalid metaDescription at index ${index}: ${item.href}`);
    }
    if (!item.h1) {
      errors.push(`Missing h1 at index ${index}: ${item.href}`);
    }
    if (!item.intro || item.intro.length < 20) {
      errors.push(`Invalid intro at index ${index}: ${item.href}`);
    }
    if (!item.keywords || item.keywords.length === 0) {
      errors.push(`Missing keywords at index ${index}: ${item.href}`);
    }
    if (!item.intents || item.intents.length === 0) {
      errors.push(`Missing intents at index ${index}: ${item.href}`);
    }
    if (!item.faqs || item.faqs.length < 2) {
      errors.push(`Insufficient FAQs at index ${index}: ${item.href} (need at least 2)`);
    }

    // Validate FAQs structure
    item.faqs.forEach((faq, faqIndex) => {
      if (!faq.q || faq.q.length < 5) {
        errors.push(`Invalid FAQ question at ${item.href}, FAQ ${faqIndex}`);
      }
      if (!faq.a || faq.a.length < 10) {
        errors.push(`Invalid FAQ answer at ${item.href}, FAQ ${faqIndex}`);
      }
    });
  });

  if (errors.length > 0) {
    throw new Error(`SEO Intent Graph validation failed:\n${errors.join('\n')}`);
  }
}

// Run validation in development
if (process.env.NODE_ENV === 'development') {
  try {
    validateSEOIntentGraph();
    console.log('SEO Intent Graph validated successfully');
  } catch (error) {
    console.error('SEO Intent Graph validation failed:', error);
  }
}