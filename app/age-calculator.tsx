"use client";

import { useState, useEffect } from "react";

type ZodiacSign = {
  sign: string;
  emoji: string;
};

type ChineseZodiac = {
  animal: string;
  emoji: string;
};

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [compareDate, setCompareDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showAgeDifference, setShowAgeDifference] = useState(false);
  const [person1Birth, setPerson1Birth] = useState("");
  const [person2Birth, setPerson2Birth] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!birthDate) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [birthDate]);

  function createSafeDate(dateString: string): Date {
    return new Date(dateString + 'T00:00:00');
  }

  function calculateAge(from: Date, to: Date) {
    let years = to.getFullYear() - from.getFullYear();
    let months = to.getMonth() - from.getMonth();
    let days = to.getDate() - from.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMs = to.getTime() - from.getTime();
    const hours = Math.floor(totalMs / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor(totalMs / (1000 * 60)) % 60;
    const seconds = Math.floor(totalMs / 1000) % 60;

    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(totalMs / (1000 * 60));
    const totalSeconds = Math.floor(totalMs / 1000);

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds
    };
  }

  function getNextBirthday(birthDate: Date) {
    const now = new Date();
    const thisYear = now.getFullYear();
    let nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
    
    if (birthDate.getMonth() === 1 && birthDate.getDate() === 29) {
      if (!isLeapYear(thisYear)) {
        nextBirthday = new Date(thisYear, 1, 28);
      }
    }

    if (nextBirthday < now) {
      nextBirthday = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
      if (birthDate.getMonth() === 1 && birthDate.getDate() === 29 && !isLeapYear(thisYear + 1)) {
        nextBirthday = new Date(thisYear + 1, 1, 28);
      }
    }

    const diff = nextBirthday.getTime() - now.getTime();
    const daysUntil = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weekday = nextBirthday.toLocaleDateString('en-US', { weekday: 'long' });

    return { daysUntil, weekday, date: nextBirthday };
  }

  function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function getChineseNewYear(year: number): Date {
    const cnyDates: { [key: number]: string } = {
      1900: "01-31", 1901: "02-19", 1902: "02-08", 1903: "01-29", 1904: "02-16",
      1905: "02-04", 1906: "01-25", 1907: "02-13", 1908: "02-02", 1909: "01-22",
      1910: "02-10", 1911: "01-30", 1912: "02-18", 1913: "02-06", 1914: "01-26",
      1915: "02-14", 1916: "02-03", 1917: "01-23", 1918: "02-11", 1919: "02-01",
      1920: "02-20", 1921: "02-08", 1922: "01-28", 1923: "02-16", 1924: "02-05",
      1925: "01-24", 1926: "02-13", 1927: "02-02", 1928: "01-23", 1929: "02-10",
      1930: "01-30", 1931: "02-17", 1932: "02-06", 1933: "01-26", 1934: "02-14",
      1935: "02-04", 1936: "01-24", 1937: "02-11", 1938: "01-31", 1939: "02-19",
      1940: "02-08", 1941: "01-27", 1942: "02-15", 1943: "02-05", 1944: "01-25",
      1945: "02-13", 1946: "02-02", 1947: "01-22", 1948: "02-10", 1949: "01-29",
      1950: "02-17", 1951: "02-06", 1952: "01-27", 1953: "02-14", 1954: "02-03",
      1955: "01-24", 1956: "02-12", 1957: "01-31", 1958: "02-18", 1959: "02-08",
      1960: "01-28", 1961: "02-15", 1962: "02-05", 1963: "01-25", 1964: "02-13",
      1965: "02-02", 1966: "01-21", 1967: "02-09", 1968: "01-30", 1969: "02-17",
      1970: "02-06", 1971: "01-27", 1972: "02-15", 1973: "02-03", 1974: "01-23",
      1975: "02-11", 1976: "01-31", 1977: "02-18", 1978: "02-07", 1979: "01-28",
      1980: "02-16", 1981: "02-05", 1982: "01-25", 1983: "02-13", 1984: "02-02",
      1985: "02-20", 1986: "02-09", 1987: "01-29", 1988: "02-17", 1989: "02-06",
      1990: "01-27", 1991: "02-15", 1992: "02-04", 1993: "01-23", 1994: "02-10",
      1995: "01-31", 1996: "02-19", 1997: "02-07", 1998: "01-28", 1999: "02-16",
      2000: "02-05", 2001: "01-24", 2002: "02-12", 2003: "02-01", 2004: "01-22",
      2005: "02-09", 2006: "01-29", 2007: "02-18", 2008: "02-07", 2009: "01-26",
      2010: "02-14", 2011: "02-03", 2012: "01-23", 2013: "02-10", 2014: "01-31",
      2015: "02-19", 2016: "02-08", 2017: "01-28", 2018: "02-16", 2019: "02-05",
      2020: "01-25", 2021: "02-12", 2022: "02-01", 2023: "01-22", 2024: "02-10",
      2025: "01-29", 2026: "02-17", 2027: "02-06", 2028: "01-26", 2029: "02-13",
      2030: "02-03"
    };
    
    const dateStr = cnyDates[year];
    if (dateStr) {
      return new Date(year + '-' + dateStr + 'T00:00:00');
    }
    return new Date(year, 1, 1);
  }

  function getZodiacSign(month: number, day: number): ZodiacSign {
    const signs = [
      { sign: "Capricorn", emoji: "♑", start: [12, 22], end: [1, 19] },
      { sign: "Aquarius", emoji: "♒", start: [1, 20], end: [2, 18] },
      { sign: "Pisces", emoji: "♓", start: [2, 19], end: [3, 20] },
      { sign: "Aries", emoji: "♈", start: [3, 21], end: [4, 19] },
      { sign: "Taurus", emoji: "♉", start: [4, 20], end: [5, 20] },
      { sign: "Gemini", emoji: "♊", start: [5, 21], end: [6, 20] },
      { sign: "Cancer", emoji: "♋", start: [6, 21], end: [7, 22] },
      { sign: "Leo", emoji: "♌", start: [7, 23], end: [8, 22] },
      { sign: "Virgo", emoji: "♍", start: [8, 23], end: [9, 22] },
      { sign: "Libra", emoji: "♎", start: [9, 23], end: [10, 22] },
      { sign: "Scorpio", emoji: "♏", start: [10, 23], end: [11, 21] },
      { sign: "Sagittarius", emoji: "♐", start: [11, 22], end: [12, 21] }
    ];

    for (const s of signs) {
      const [startMonth, startDay] = s.start;
      const [endMonth, endDay] = s.end;
      
      if (month === startMonth && day >= startDay) return s;
      if (month === endMonth && day <= endDay) return s;
    }
    
    return signs[0];
  }

  function getChineseZodiac(birthDate: Date): ChineseZodiac {
    const animals = [
      { animal: "Rat", emoji: "🐀" },
      { animal: "Ox", emoji: "🐂" },
      { animal: "Tiger", emoji: "🐅" },
      { animal: "Rabbit", emoji: "🐇" },
      { animal: "Dragon", emoji: "🐉" },
      { animal: "Snake", emoji: "🐍" },
      { animal: "Horse", emoji: "🐎" },
      { animal: "Goat", emoji: "🐐" },
      { animal: "Monkey", emoji: "🐒" },
      { animal: "Rooster", emoji: "🐓" },
      { animal: "Dog", emoji: "🐕" },
      { animal: "Pig", emoji: "🐖" }
    ];
    
    let year = birthDate.getFullYear();
    const cny = getChineseNewYear(year);
    
    if (birthDate < cny) {
      year--;
    }
    
    return animals[(year - 4) % 12];
  }

  function getAgeOnPlanets(earthDays: number) {
    const orbitalPeriods: { [key: string]: number } = {
      Mercury: 87.97,
      Venus: 224.7,
      Mars: 687.0,
      Jupiter: 4332.6,
      Saturn: 10759.2
    };

    const ages: { [key: string]: number } = {};
    for (const [planet, days] of Object.entries(orbitalPeriods)) {
      ages[planet] = earthDays / days;
    }
    return ages;
  }

  const birth = birthDate ? createSafeDate(birthDate) : null;
  const compare = compareDate ? createSafeDate(compareDate) : null;
  const age = birth ? calculateAge(birth, currentTime) : null;
  const compareAge = birth && compare ? calculateAge(birth, compare) : null;
  const nextBirthday = birth ? getNextBirthday(birth) : null;
  const zodiac = birth ? getZodiacSign(birth.getMonth() + 1, birth.getDate()) : null;
  const chineseZodiac = birth ? getChineseZodiac(birth) : null;
  const dayOfWeek = birth ? birth.toLocaleDateString('en-US', { weekday: 'long' }) : null;
  const planetAges = age ? getAgeOnPlanets(age.totalDays) : null;

  const person1 = person1Birth ? createSafeDate(person1Birth) : null;
  const person2 = person2Birth ? createSafeDate(person2Birth) : null;
  const ageDifference = person1 && person2 ? calculateAge(person1 < person2 ? person1 : person2, person1 < person2 ? person2 : person1) : null;

  function shareResults() {
    if (!age || !birth) return;
    
    const text = `I am ${age.years} years, ${age.months} months, and ${age.days} days old!
Born: ${birth.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Total: ${age.totalDays.toLocaleString()} days lived
Zodiac: ${zodiac?.emoji} ${zodiac?.sign}
Chinese Zodiac: ${chineseZodiac?.emoji} ${chineseZodiac?.animal}
Next Birthday: ${nextBirthday?.daysUntil} days (${nextBirthday?.weekday})`;

    if (navigator.share) {
      navigator.share({ title: "My Age", text })
        .catch((error) => {
          if (error.name !== 'AbortError') console.error('Share failed:', error);
        });
    } else {
      navigator.clipboard.writeText(text);
      alert("📋 Copied to clipboard!");
    }
  }

  const hasDate = birth !== null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <header className="mb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Age Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Calculate your exact age with live countdown, zodiac signs, and planetary ages
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-4 sm:gap-6 items-start">
          <section className="space-y-4">
            {/* Main Date Input */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Your Date of Birth</h2>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-4 text-lg text-gray-900 font-semibold border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                style={{ colorScheme: 'light' }}
              />
            </div>

            {/* Date Comparison */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showComparison}
                  onChange={(e) => setShowComparison(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-semibold text-gray-700">Calculate age on a specific date</span>
              </label>
              
              {showComparison && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Compare Date</label>
                  <input
                    type="date"
                    value={compareDate}
                    onChange={(e) => setCompareDate(e.target.value)}
                    className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              )}
            </div>

            {/* Age Difference Calculator */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAgeDifference}
                  onChange={(e) => setShowAgeDifference(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-semibold text-gray-700">Calculate age difference between two people</span>
              </label>
              
              {showAgeDifference && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Person 1 Birth Date</label>
                    <input
                      type="date"
                      value={person1Birth}
                      onChange={(e) => setPerson1Birth(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Person 2 Birth Date</label>
                    <input
                      type="date"
                      value={person2Birth}
                      onChange={(e) => setPerson2Birth(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 text-base text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                  {ageDifference && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">
                        Age Difference
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {ageDifference.years} years, {ageDifference.months} months, {ageDifference.days} days
                      </div>
                      <div className="text-sm text-blue-700 mt-1">
                        Total: {ageDifference.totalDays.toLocaleString()} days apart
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Advanced Features */}
            {hasDate && (
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-lg font-bold text-gray-900">Advanced Features</span>
                  <span className="text-gray-400 text-xl">{showAdvanced ? '▼' : '▶'}</span>
                </button>
                
                {showAdvanced && (
                  <div className="mt-4 space-y-4">
                    {/* Zodiac Signs */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-xs font-semibold text-purple-900 mb-1">Zodiac Sign</div>
                        <div className="text-2xl">{zodiac?.emoji}</div>
                        <div className="font-bold text-purple-900">{zodiac?.sign}</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-xs font-semibold text-red-900 mb-1">Chinese Zodiac</div>
                        <div className="text-2xl">{chineseZodiac?.emoji}</div>
                        <div className="font-bold text-red-900">{chineseZodiac?.animal}</div>
                      </div>
                    </div>

                    {/* Day of Week Born */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs font-semibold text-blue-900 mb-1">You Were Born On</div>
                      <div className="font-bold text-blue-900 text-lg">{dayOfWeek}</div>
                    </div>

                    {/* Planetary Ages */}
                    {planetAges && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-2">Your Age on Other Planets</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {Object.entries(planetAges).map(([planet, age]) => (
                            <div key={planet} className="p-2 bg-gray-50 rounded-lg text-center">
                              <div className="text-xs text-gray-600">{planet}</div>
                              <div className="font-bold text-indigo-600">{age.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Results */}
          <aside className="lg:sticky lg:top-6">
            {hasDate ? (
              <>
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-200">
                  {!showComparison || !compareAge ? (
                    <>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Your Current Age
                      </div>
                      <div className="mb-4">
                        <div className="text-3xl sm:text-4xl font-bold text-indigo-600">
                          {age?.years} <span className="text-lg text-gray-600">years</span>
                        </div>
                        <div className="text-lg font-semibold text-gray-700 mt-1">
                          {age?.months} months, {age?.days} days
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {age?.hours}h {age?.minutes}m {age?.seconds}s
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Age on {compare?.toLocaleDateString()}
                      </div>
                      <div className="mb-4">
                        <div className="text-3xl sm:text-4xl font-bold text-indigo-600">
                          {compareAge?.years} <span className="text-lg text-gray-600">years</span>
                        </div>
                        <div className="text-lg font-semibold text-gray-700 mt-1">
                          {compareAge?.months} months, {compareAge?.days} days
                        </div>
                      </div>
                    </>
                  )}

                  {/* Life Milestones */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Days</span>
                      <span className="font-semibold text-gray-900">{age?.totalDays.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Hours</span>
                      <span className="font-semibold text-gray-900">{age?.totalHours.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Minutes</span>
                      <span className="font-semibold text-gray-900">{age?.totalMinutes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Seconds</span>
                      <span className="font-semibold text-gray-900">{age?.totalSeconds.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Next Birthday */}
                  {nextBirthday && !showComparison && (
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                      <div className="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-1">
                        🎂 Next Birthday
                      </div>
                      <div className="text-2xl font-bold text-purple-900">
                        {nextBirthday.daysUntil} days
                      </div>
                      <div className="text-sm text-purple-700">
                        {nextBirthday.weekday}, {nextBirthday.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
                <div className="text-4xl mb-2">🎂</div>
                <div className="text-gray-600 text-sm font-medium">
                  Enter your date of birth to calculate
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* SEO Content Below Calculator */}
        <div className="mt-12 space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Use This Age Calculator
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our precise age calculator determines your exact age in years, months, days, hours, minutes, and seconds. 
              Simply enter your date of birth and the calculator instantly shows your current age with a live countdown 
              that updates every second. The tool accounts for leap years, varying month lengths, and time zones to 
              provide accurate results.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Perfect for filling out forms, tracking milestones, planning birthdays, verifying age requirements, or 
              simply knowing exactly how long you've been alive. The calculator also shows your zodiac signs, the day 
              of the week you were born, next birthday countdown, and even your age on other planets in the solar system.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why Use Our Age Calculator?
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Real-Time Precision:</strong> Live countdown showing your age down to the exact second with continuous updates.</p>
              <p><strong>Multiple Formats:</strong> See your age in years, months, days, hours, minutes, seconds, and total days lived.</p>
              <p><strong>Date Comparison:</strong> Calculate how old you were or will be on any specific date in the past or future.</p>
              <p><strong>Age Difference:</strong> Find the exact age gap between two people in years, months, and days.</p>
              <p><strong>Birthday Countdown:</strong> Know exactly how many days until your next birthday and what day of the week it falls on.</p>
              <p><strong>Zodiac Signs:</strong> Discover both your Western zodiac sign and Chinese zodiac animal automatically.</p>
              <p><strong>Advanced Features:</strong> See what day of the week you were born and your age on other planets (Mercury, Venus, Mars, Jupiter, Saturn).</p>
              <p><strong>100% Private:</strong> All calculations happen in your browser, no data is stored or transmitted anywhere.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Key Features
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Live age countdown updating every second</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Calculate age in years, months, days, hours, minutes, seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Find your age on any past or future date</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Calculate age difference between two people</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Next birthday countdown with weekday</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Western zodiac sign (Aries to Pisces)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Chinese zodiac animal (Rat to Pig)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Day of the week you were born</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Your age on Mercury, Venus, Mars, Jupiter, Saturn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Accurate leap year calculations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Share results via text or social media</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Mobile-friendly, works offline, completely free</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Common Use Cases
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Official Documents:</strong> Fill out passport applications, visa forms, insurance documents, medical records, and legal papers requiring exact age.</p>
              <p><strong>Age Verification:</strong> Verify you meet minimum age requirements for job applications, voting registration, alcohol purchase, driver's license, or senior discounts.</p>
              <p><strong>Milestone Celebrations:</strong> Track days until milestone birthdays like turning 18, 21, 30, 40, 50, 65, or 100 years old.</p>
              <p><strong>School Registration:</strong> Determine age eligibility for kindergarten, grade placement, or school sports teams that have age cutoffs.</p>
              <p><strong>Retirement Planning:</strong> Calculate exact age for retirement benefits, pension eligibility, or Social Security qualification.</p>
              <p><strong>Relationship Comparisons:</strong> Find the age difference between partners, siblings, or family members for curiosity or family records.</p>
              <p><strong>Historical Context:</strong> Determine how old you were during significant historical events, elections, or world moments.</p>
              <p><strong>Birthday Planning:</strong> Know what day of the week your upcoming birthday falls on for party planning and scheduling.</p>
              <p><strong>Astrology and Horoscopes:</strong> Discover your zodiac sign for reading horoscopes, compatibility charts, or birth chart creation.</p>
              <p><strong>Social Media Posts:</strong> Share interesting age facts like total days lived or your age on other planets with friends and followers.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How Age is Calculated
            </h2>
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded mb-3">
              <p className="text-gray-800 font-semibold mb-2">Age Calculation Method:</p>
              <div className="text-gray-800 text-sm space-y-2">
                <p>1. <strong>Years:</strong> Current year minus birth year, adjusted if birthday hasn't occurred yet this year</p>
                <p>2. <strong>Months:</strong> Current month minus birth month, adding 12 and subtracting a year if negative</p>
                <p>3. <strong>Days:</strong> Current day minus birth day, accounting for different month lengths</p>
                <p>4. <strong>Time Units:</strong> Calculate milliseconds between dates and convert to hours, minutes, seconds</p>
                <p>5. <strong>Leap Years:</strong> February 29 birthdays are recognized and adjusted in non-leap years</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For example, if you were born on March 15, 1990, and today is January 20, 2026, the calculator computes: 
              35 years (2026 - 1990 - 1, since birthday hasn't occurred yet), 10 months (12 - 3 + 1), and 5 days 
              (20 - 15). The tool then converts the total time to seconds for the live countdown feature.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Understanding Zodiac Signs
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Western Zodiac (12 signs):</strong> Based on the position of the sun at your birth. The 12 zodiac signs are Aries (March 21-April 19), Taurus (April 20-May 20), Gemini (May 21-June 20), Cancer (June 21-July 22), Leo (July 23-August 22), Virgo (August 23-September 22), Libra (September 23-October 22), Scorpio (October 23-November 21), Sagittarius (November 22-December 21), Capricorn (December 22-January 19), Aquarius (January 20-February 18), and Pisces (February 19-March 20).</p>
              <p><strong>Chinese Zodiac (12 animals):</strong> Based on the lunar calendar and year of birth. The cycle includes Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. Each year is associated with one animal, and the Chinese New Year date (between January 21 and February 20) determines which year you belong to.</p>
              <p><strong>Zodiac Compatibility:</strong> Many people use zodiac signs to check romantic compatibility, understand personality traits, or read daily horoscopes. While not scientifically proven, astrology remains culturally significant worldwide.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Your Age on Other Planets
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Planet</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Orbital Period (Earth Days)</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Example Age (30 Earth Years)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-2 font-semibold">Mercury</td>
                    <td className="px-4 py-2">88 days</td>
                    <td className="px-4 py-2">124.5 Mercury years</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">Venus</td>
                    <td className="px-4 py-2">225 days</td>
                    <td className="px-4 py-2">48.7 Venus years</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">Earth</td>
                    <td className="px-4 py-2">365 days</td>
                    <td className="px-4 py-2">30.0 Earth years</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">Mars</td>
                    <td className="px-4 py-2">687 days</td>
                    <td className="px-4 py-2">15.9 Mars years</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">Jupiter</td>
                    <td className="px-4 py-2">4,333 days (11.9 Earth years)</td>
                    <td className="px-4 py-2">2.5 Jupiter years</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">Saturn</td>
                    <td className="px-4 py-2">10,759 days (29.5 Earth years)</td>
                    <td className="px-4 py-2">1.0 Saturn years</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm mt-3">
              Your planetary age is calculated by dividing your total Earth days by each planet's orbital period. 
              You'd age much faster on Mercury but much slower on Jupiter or Saturn!
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Birthday Facts and Trivia
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Most Common Birthday:</strong> September 9 is statistically the most common birthday in the United States, with many September birthdays resulting from December holidays.</p>
              <p><strong>Least Common Birthday:</strong> February 29 (leap day) is the rarest birthday, occurring only once every four years. People born on this day are called "leaplings" or "leapers."</p>
              <p><strong>Birthday Probability:</strong> In a room of just 23 people, there's a 50% chance two people share the same birthday (the famous "birthday paradox").</p>
              <p><strong>Golden Birthday:</strong> Your golden birthday occurs when you turn the same age as the day of the month you were born (e.g., turning 25 on the 25th).</p>
              <p><strong>Beddian Birthday:</strong> The year when your age matches the last two digits of your birth year (e.g., turning 34 in 2034 if born in 2000).</p>
              <p><strong>Champagne Birthday:</strong> When your age matches the day you were born (similar to golden birthday but specifically on that exact day).</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Leap Year Birthdays
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>What is a Leap Year?</strong> A leap year occurs every four years when an extra day (February 29) is added to the calendar to keep it synchronized with Earth's orbit around the sun.</p>
              <p><strong>Leap Year Rules:</strong> A year is a leap year if it's divisible by 4, except for century years (1900, 2100) which must be divisible by 400 (like 2000) to be leap years.</p>
              <p><strong>February 29 Birthdays:</strong> About 1 in 1,461 people are born on leap day. Legal documents typically recognize March 1 as the legal birthday in non-leap years.</p>
              <p><strong>Celebration Options:</strong> Leaplings often celebrate on February 28 or March 1 in non-leap years, or go all out on their actual birthday every four years.</p>
              <p><strong>Famous Leaplings:</strong> Notable people born on February 29 include rapper Ja Rule, motivational speaker Tony Robbins, and actor Antonio Sabàto Jr.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Age Milestones Around the World
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Age 18:</strong> Legal adulthood in most countries - can vote, sign contracts, join military, buy lottery tickets, get tattoos without parental consent.</p>
              <p><strong>Age 21:</strong> Legal drinking age in the United States and other countries. In some cultures, marks full adulthood and independence.</p>
              <p><strong>Age 16:</strong> Driving age in many US states, working age with restrictions, age of consent in some regions.</p>
              <p><strong>Age 13:</strong> Bar/Bat Mitzvah in Jewish tradition, teenager milestone, minimum age for many social media platforms.</p>
              <p><strong>Age 65:</strong> Traditional retirement age and Medicare eligibility in the US, senior citizen discounts begin.</p>
              <p><strong>Age 100:</strong> Centenarian milestone - reaching 100 years old. Often receives recognition letters from government leaders.</p>
              <p><strong>Cultural Celebrations:</strong> Quinceañera at 15 (Latin America), Coming of Age Day at 20 (Japan), Sweet 16 (USA), Debutante Ball at 18 (various countries).</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Tips for Using the Age Calculator
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">1.</span>
                <span><strong>Verify Your Birth Date:</strong> Double-check you entered the correct month, day, and year to ensure accurate calculations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">2.</span>
                <span><strong>Use Compare Feature:</strong> Calculate your age on important historical dates to add context to world events you've lived through.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">3.</span>
                <span><strong>Screenshot Results:</strong> Take a screenshot of your age calculation for record-keeping or sharing on special milestone birthdays.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">4.</span>
                <span><strong>Check Age Difference:</strong> Use the age difference feature to compare ages with siblings, parents, or historical figures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">5.</span>
                <span><strong>Bookmark for Later:</strong> Save this page as a bookmark to quickly check your age whenever needed for forms or documents.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">6.</span>
                <span><strong>Explore Advanced Features:</strong> Click on advanced features to discover your zodiac signs, planetary ages, and birth day of the week.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">7.</span>
                <span><strong>Plan Ahead:</strong> Use the birthday countdown to plan celebrations well in advance, especially for milestone birthdays.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How accurate is this age calculator?</h3>
                <p className="text-gray-700">The calculator is precise to the second, accounting for leap years, varying month lengths (28-31 days), and exact time differences. It updates continuously to show your age in real-time.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What if I was born on February 29?</h3>
                <p className="text-gray-700">The calculator recognizes leap day birthdays and adjusts your next birthday to February 28 in non-leap years. Your age calculation remains accurate across all years.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can I calculate someone else's age?</h3>
                <p className="text-gray-700">Yes, simply enter any birth date to calculate age. The tool works for anyone's birthday, including celebrities, historical figures, or family members.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do you calculate age difference between two people?</h3>
                <p className="text-gray-700">Enable the "age difference" feature, enter both birth dates, and the calculator shows the exact difference in years, months, days, and total days apart.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Why does my zodiac sign matter?</h3>
                <p className="text-gray-700">Zodiac signs are used in astrology for personality insights, compatibility matching, and horoscope readings. While not scientifically proven, many people find them culturally interesting.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Is my data saved or shared?</h3>
                <p className="text-gray-700">No, all calculations happen locally in your browser. Your birth date is never sent to any server, stored, or shared. The calculator works completely offline for privacy.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can I use this for legal documents?</h3>
                <p className="text-gray-700">Yes, the age calculation is mathematically accurate and can be used to verify age for forms, applications, and documents requiring your exact age or date of birth.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How is planetary age calculated?</h3>
                <p className="text-gray-700">Your Earth days lived is divided by each planet's orbital period (time to complete one orbit around the sun). For example, Jupiter takes 11.9 Earth years per orbit.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What does the live countdown show?</h3>
                <p className="text-gray-700">The live countdown displays your exact age including hours, minutes, and seconds, updating every second to show how long you've been alive in real-time.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can I calculate my age on a future date?</h3>
                <p className="text-gray-700">Yes, use the "calculate age on a specific date" feature and select any future date to see how old you'll be on that day.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Fun Age Facts
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Life Expectancy:</strong> Global average life expectancy is about 73 years, but varies significantly by country, gender, and lifestyle factors.</p>
              <p><strong>Billion Seconds:</strong> You'll be approximately 31.7 years old when you've lived for one billion seconds.</p>
              <p><strong>10,000 Days:</strong> The 10,000-day milestone occurs around age 27 and is celebrated by some as a unique birthday.</p>
              <p><strong>Heart Beats:</strong> An average human heart beats about 2.5 billion times in a lifetime, or approximately 100,000 times per day.</p>
              <p><strong>Oldest Person:</strong> The oldest verified person ever was Jeanne Calment of France, who lived to 122 years and 164 days.</p>
              <p><strong>Age in Dog Years:</strong> The old "multiply by 7" rule is inaccurate. Dogs age faster in their first two years, then about 4-5 human years per dog year after.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}