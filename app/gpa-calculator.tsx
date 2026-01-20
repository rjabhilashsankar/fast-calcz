"use client";

import { useState } from "react";

type Course = {
  id: string;
  name: string;
  grade: string;
  credits: string;
};

type Semester = {
  id: string;
  name: string;
  courses: Course[];
};

type GradingSystem = {
  id: string;
  name: string;
  country: string;
  scale: number;
  grades: { [key: string]: number };
  gradeOptions: string[];
};

const gradingSystems: GradingSystem[] = [
  {
    id: "us-4.0",
    name: "US 4.0 Scale",
    country: "United States",
    scale: 4.0,
    grades: {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "D-": 0.7,
      "F": 0.0
    },
    gradeOptions: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"]
  },
  {
    id: "india-10",
    name: "India 10-Point CGPA",
    country: "India",
    scale: 10.0,
    grades: {
      "O (Outstanding)": 10.0,
      "A+ (Excellent)": 9.0,
      "A (Very Good)": 8.0,
      "B+ (Good)": 7.0,
      "B (Above Average)": 6.0,
      "C (Average)": 5.0,
      "P (Pass)": 4.0,
      "F (Fail)": 0.0
    },
    gradeOptions: ["O (Outstanding)", "A+ (Excellent)", "A (Very Good)", "B+ (Good)", "B (Above Average)", "C (Average)", "P (Pass)", "F (Fail)"]
  },
  {
    id: "germany-5",
    name: "Germany 1-5 Scale (Lower is Better)",
    country: "Germany",
    scale: 5.0,
    grades: {
      "1.0 (Sehr gut)": 1.0,
      "1.3": 1.3,
      "1.7": 1.7,
      "2.0 (Gut)": 2.0,
      "2.3": 2.3,
      "2.7": 2.7,
      "3.0 (Befriedigend)": 3.0,
      "3.3": 3.3,
      "3.7": 3.7,
      "4.0 (Ausreichend)": 4.0,
      "5.0 (Nicht bestanden)": 5.0
    },
    gradeOptions: ["1.0 (Sehr gut)", "1.3", "1.7", "2.0 (Gut)", "2.3", "2.7", "3.0 (Befriedigend)", "3.3", "3.7", "4.0 (Ausreichend)", "5.0 (Nicht bestanden)"]
  },
  {
    id: "uk-class",
    name: "UK Degree Classification",
    country: "United Kingdom",
    scale: 4.0,
    grades: {
      "First Class (70-100%)": 4.0,
      "Upper Second (60-69%)": 3.3,
      "Lower Second (50-59%)": 2.7,
      "Third Class (40-49%)": 2.0,
      "Fail (0-39%)": 0.0
    },
    gradeOptions: ["First Class (70-100%)", "Upper Second (60-69%)", "Lower Second (50-59%)", "Third Class (40-49%)", "Fail (0-39%)"]
  },
  {
    id: "canada-4.0",
    name: "Canada 4.0 Scale",
    country: "Canada",
    scale: 4.0,
    grades: {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0,
      "F": 0.0
    },
    gradeOptions: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"]
  },
  {
    id: "australia-7",
    name: "Australia 7-Point GPA",
    country: "Australia",
    scale: 7.0,
    grades: {
      "HD (High Distinction)": 7.0,
      "D (Distinction)": 6.0,
      "C (Credit)": 5.0,
      "P (Pass)": 4.0,
      "F (Fail)": 0.0
    },
    gradeOptions: ["HD (High Distinction)", "D (Distinction)", "C (Credit)", "P (Pass)", "F (Fail)"]
  },
  {
    id: "singapore-5",
    name: "Singapore 5.0 Scale",
    country: "Singapore",
    scale: 5.0,
    grades: {
      "A+": 5.0, "A": 5.0, "A-": 4.5,
      "B+": 4.0, "B": 3.5, "B-": 3.0,
      "C+": 2.5, "C": 2.0,
      "D+": 1.5, "D": 1.0,
      "F": 0.0
    },
    gradeOptions: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D+", "D", "F"]
  },
  {
    id: "france-20",
    name: "France 20-Point Scale",
    country: "France",
    scale: 20.0,
    grades: {
      "18-20 (Très bien)": 19.0,
      "16-17.9 (Bien)": 16.5,
      "14-15.9 (Assez bien)": 15.0,
      "12-13.9 (Passable)": 13.0,
      "10-11.9 (Passable)": 11.0,
      "0-9.9 (Insuffisant)": 5.0
    },
    gradeOptions: ["18-20 (Très bien)", "16-17.9 (Bien)", "14-15.9 (Assez bien)", "12-13.9 (Passable)", "10-11.9 (Passable)", "0-9.9 (Insuffisant)"]
  },
  {
    id: "netherlands-10",
    name: "Netherlands 10-Point Scale",
    country: "Netherlands",
    scale: 10.0,
    grades: {
      "10 (Outstanding)": 10.0,
      "9 (Very Good)": 9.0,
      "8 (Good)": 8.0,
      "7 (Satisfactory)": 7.0,
      "6 (Sufficient)": 6.0,
      "5 (Fail)": 5.0,
      "4 (Fail)": 4.0,
      "3 (Fail)": 3.0,
      "2 (Fail)": 2.0,
      "1 (Very Poor)": 1.0
    },
    gradeOptions: ["10 (Outstanding)", "9 (Very Good)", "8 (Good)", "7 (Satisfactory)", "6 (Sufficient)", "5 (Fail)", "4 (Fail)", "3 (Fail)", "2 (Fail)", "1 (Very Poor)"]
  },
  {
    id: "china-100",
    name: "China Percentage to 4.0 GPA",
    country: "China",
    scale: 4.0,
    grades: {
      "90-100 (优秀 Excellent)": 4.0,
      "80-89 (良好 Good)": 3.0,
      "70-79 (中等 Average)": 2.0,
      "60-69 (及格 Pass)": 1.0,
      "0-59 (不及格 Fail)": 0.0
    },
    gradeOptions: ["90-100 (优秀 Excellent)", "80-89 (良好 Good)", "70-79 (中等 Average)", "60-69 (及格 Pass)", "0-59 (不及格 Fail)"]
  },
  {
    id: "custom",
    name: "Custom Scale",
    country: "Custom",
    scale: 4.0,
    grades: {},
    gradeOptions: []
  }
];

export default function GPACalculator() {
  const [selectedSystem, setSelectedSystem] = useState<string>("us-4.0");
  const [customScale, setCustomScale] = useState("4.0");
  const [customGrades, setCustomGrades] = useState<{ name: string; value: string }[]>([
    { name: "A", value: "4.0" },
    { name: "B", value: "3.0" },
    { name: "C", value: "2.0" },
    { name: "D", value: "1.0" },
    { name: "F", value: "0.0" }
  ]);
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: "1", name: "Semester 1", courses: [] }
  ]);
  const [cumulativeGPA, setCumulativeGPA] = useState("");
  const [cumulativeCredits, setCumulativeCredits] = useState("");
  const [targetGPA, setTargetGPA] = useState("");
  const [targetCredits, setTargetCredits] = useState("");
  const [showPreviousGPA, setShowPreviousGPA] = useState(false);
  const [showTargetGPA, setShowTargetGPA] = useState(false);

  const currentSystem = gradingSystems.find(s => s.id === selectedSystem) || gradingSystems[0];
  
  const getCurrentScale = (): number => {
    if (selectedSystem === "custom") {
      return Number(customScale) || 4.0;
    }
    return currentSystem.scale;
  };
  
  const getGradePoints = (grade: string): number => {
    if (selectedSystem === "custom") {
      const customGrade = customGrades.find(g => g.name === grade);
      return customGrade ? Number(customGrade.value) || 0 : 0;
    }
    return currentSystem.grades[grade] || 0;
  };

  const getGradeOptions = (): string[] => {
    if (selectedSystem === "custom") {
      return customGrades.map(g => g.name).filter(name => name.trim() !== "");
    }
    return currentSystem.gradeOptions;
  };

  function addCustomGrade() {
    setCustomGrades([...customGrades, { name: "", value: "" }]);
  }

  function updateCustomGrade(index: number, field: "name" | "value", value: string) {
    setCustomGrades(customGrades.map((g, i) => i === index ? { ...g, [field]: value } : g));
  }

  function removeCustomGrade(index: number) {
    if (customGrades.length === 1) return;
    setCustomGrades(customGrades.filter((_, i) => i !== index));
  }

  function addSemester() {
    const newId = (semesters.length + 1).toString();
    setSemesters([...semesters, { id: newId, name: `Semester ${newId}`, courses: [] }]);
  }

  function removeSemester(semesterId: string) {
    if (semesters.length === 1) return;
    setSemesters(semesters.filter(s => s.id !== semesterId));
  }

  function updateSemesterName(semesterId: string, name: string) {
    setSemesters(semesters.map(s => s.id === semesterId ? { ...s, name } : s));
  }

  function addCourse(semesterId: string) {
    const defaultGrade = getGradeOptions()[0] || "A";
    setSemesters(semesters.map(s => {
      if (s.id === semesterId) {
        const newCourse: Course = { 
          id: Date.now().toString(), 
          name: "", 
          grade: defaultGrade, 
          credits: "3" 
        };
        return { ...s, courses: [...s.courses, newCourse] };
      }
      return s;
    }));
  }

  function updateCourse(semesterId: string, courseId: string, field: keyof Course, value: string) {
    setSemesters(semesters.map(s => {
      if (s.id === semesterId) {
        return {
          ...s,
          courses: s.courses.map(c => 
            c.id === courseId ? { ...c, [field]: value } : c
          )
        };
      }
      return s;
    }));
  }

  function removeCourse(semesterId: string, courseId: string) {
    setSemesters(semesters.map(s => {
      if (s.id === semesterId) {
        return { ...s, courses: s.courses.filter(c => c.id !== courseId) };
      }
      return s;
    }));
  }

  function duplicateCourse(semesterId: string, courseId: string) {
    setSemesters(semesters.map(s => {
      if (s.id === semesterId) {
        const courseToDuplicate = s.courses.find(c => c.id === courseId);
        if (courseToDuplicate) {
          const newCourse: Course = {
            ...courseToDuplicate,
            id: Date.now().toString(),
          };
          return { ...s, courses: [...s.courses, newCourse] };
        }
      }
      return s;
    }));
  }

  function calculateSemesterGPA(courses: Course[]) {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      const credits = Number(course.credits) || 0;
      const points = getGradePoints(course.grade);
      totalPoints += points * credits;
      totalCredits += credits;
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }

  function calculateOverallGPA() {
    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach(semester => {
      semester.courses.forEach(course => {
        const credits = Number(course.credits) || 0;
        const points = getGradePoints(course.grade);
        totalPoints += points * credits;
        totalCredits += credits;
      });
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }

  function calculateCumulativeGPA() {
    const prevGPA = Number(cumulativeGPA) || 0;
    const prevCredits = Number(cumulativeCredits) || 0;
    
    let currentPoints = 0;
    let currentCredits = 0;
    
    semesters.forEach(semester => {
      semester.courses.forEach(course => {
        const credits = Number(course.credits) || 0;
        const points = getGradePoints(course.grade);
        currentPoints += points * credits;
        currentCredits += credits;
      });
    });

    const totalCredits = prevCredits + currentCredits;
    if (totalCredits === 0) return 0;

    const totalPoints = (prevGPA * prevCredits) + currentPoints;
    return totalPoints / totalCredits;
  }

  function calculateTargetGrades() {
    const target = Number(targetGPA) || 0;
    const futureCredits = Number(targetCredits) || 0;
    
    if (futureCredits === 0) {
      return { requiredGPA: 0, isPossible: false };
    }
    
    const prevGPA = Number(cumulativeGPA) || 0;
    const prevCredits = Number(cumulativeCredits) || 0;
    
    let currentPoints = 0;
    let currentCredits = 0;
    
    semesters.forEach(semester => {
      semester.courses.forEach(course => {
        const credits = Number(course.credits) || 0;
        const points = getGradePoints(course.grade);
        currentPoints += points * credits;
        currentCredits += credits;
      });
    });
    
    const totalCurrentCredits = prevCredits + currentCredits;
    const totalCurrentPoints = (prevGPA * prevCredits) + currentPoints;
    
    const totalFutureCredits = totalCurrentCredits + futureCredits;
    const requiredTotalPoints = target * totalFutureCredits;
    const requiredFuturePoints = requiredTotalPoints - totalCurrentPoints;
    const requiredFutureGPA = requiredFuturePoints / futureCredits;
    
    const maxScale = getCurrentScale();
    const isPossible = requiredFutureGPA <= maxScale && requiredFutureGPA >= 0;

    return {
      requiredGPA: requiredFutureGPA,
      isPossible
    };
  }

  const overallGPA = calculateOverallGPA();
  const finalCumulativeGPA = calculateCumulativeGPA();
  const hasCourses = semesters.some(s => s.courses.length > 0);
  const hasPreviousGPA = cumulativeGPA.trim() !== "" && cumulativeCredits.trim() !== "";
  const hasTargetGPA = targetGPA.trim() !== "" && targetCredits.trim() !== "";
  const targetResult = hasTargetGPA ? calculateTargetGrades() : null;

  function shareResults() {
    let text = `My GPA Results (${currentSystem.name}):\n\n`;
    
    semesters.forEach(semester => {
      if (semester.courses.length > 0) {
        const semGPA = calculateSemesterGPA(semester.courses);
        text += `${semester.name}: ${semGPA.toFixed(2)}\n`;
      }
    });

    text += `\nOverall GPA: ${overallGPA.toFixed(2)}`;
    
    if (hasPreviousGPA) {
      text += `\nCumulative GPA: ${finalCumulativeGPA.toFixed(2)}`;
    }

    if (navigator.share) {
      navigator.share({ title: "GPA Results", text })
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
            GPA Calculator - All Grading Systems
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Calculate GPA using US, UK, Indian, German, and 10+ international grading scales
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_360px] gap-4 sm:gap-6 items-start">
          <section className="space-y-4">
            {/* Grading System Selector */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Select Grading System</h2>
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="w-full px-3 py-3 text-sm font-semibold text-gray-900 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 outline-none bg-white"
              >
                {gradingSystems.map(system => (
                  <option key={system.id} value={system.id}>
                    {system.name} ({system.country}) - {system.scale} Scale
                  </option>
                ))}
              </select>

              {selectedSystem === "custom" && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Scale Value</label>
                    <input
                      type="number"
                      value={customScale}
                      onChange={(e) => setCustomScale(e.target.value)}
                      min="1"
                      max="100"
                      step="0.1"
                      placeholder="4.0"
                      className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Define Grades</label>
                    {customGrades.map((grade, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={grade.name}
                          onChange={(e) => updateCustomGrade(index, "name", e.target.value)}
                          placeholder="Grade name (e.g., A)"
                          className="flex-1 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                        />
                        <input
                          type="number"
                          value={grade.value}
                          onChange={(e) => updateCustomGrade(index, "value", e.target.value)}
                          placeholder="Points"
                          step="0.1"
                          className="w-24 px-3 py-2 text-sm text-gray-900 font-semibold border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                        />
                        {customGrades.length > 1 && (
                          <button
                            onClick={() => removeCustomGrade(index)}
                            className="px-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addCustomGrade}
                      className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
                    >
                      + Add Grade
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-gray-700">
                <strong className="text-blue-900">Current Scale:</strong> {selectedSystem === "custom" ? `Custom ${customScale}-point` : `${currentSystem.scale}-point`} scale
              </div>
            </div>

            {/* Previous GPA Section */}
            <details className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <summary className="p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 inline">Previous GPA (Optional)</h2>
                    <p className="text-xs text-gray-600 mt-1">Calculate cumulative GPA by including past semesters</p>
                  </div>
                  <span className="text-gray-400">▼</span>
                </div>
              </summary>
              
              <div className="p-4 sm:p-5 pt-0 border-t border-gray-100">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Previous GPA</label>
                    <input
                      type="number"
                      value={cumulativeGPA}
                      onChange={(e) => setCumulativeGPA(e.target.value)}
                      min="0"
                      max={selectedSystem === "custom" ? customScale : currentSystem.scale.toString()}
                      step="0.01"
                      placeholder="3.50"
                      className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Previous Credits</label>
                    <input
                      type="number"
                      value={cumulativeCredits}
                      onChange={(e) => setCumulativeCredits(e.target.value)}
                      min="0"
                      step="1"
                      placeholder="60"
                      className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>
                </div>
              </div>
            </details>

            {/* Target GPA Section */}
            <details className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <summary className="p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 inline">Target GPA Calculator (Optional)</h2>
                    <p className="text-xs text-gray-600 mt-1">See what GPA you need to reach your goal</p>
                  </div>
                  <span className="text-gray-400">▼</span>
                </div>
              </summary>
              
              <div className="p-4 sm:p-5 pt-0 border-t border-gray-100">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target GPA</label>
                    <input
                      type="number"
                      value={targetGPA}
                      onChange={(e) => setTargetGPA(e.target.value)}
                      min="0"
                      max={selectedSystem === "custom" ? customScale : currentSystem.scale.toString()}
                      step="0.01"
                      placeholder="3.75"
                      className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Future Credits</label>
                    <input
                      type="number"
                      value={targetCredits}
                      onChange={(e) => setTargetCredits(e.target.value)}
                      min="0"
                      step="1"
                      placeholder="12"
                      className="w-full px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>
                </div>
              </div>
            </details>

            {/* Semesters */}
            {semesters.map((semester) => (
              <div key={semester.id} className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={semester.name}
                    onChange={(e) => updateSemesterName(semester.id, e.target.value)}
                    placeholder="Semester name"
                    className="text-lg font-bold text-gray-900 border-2 border-transparent hover:border-gray-300 focus:border-indigo-500 rounded px-2 py-1 outline-none"
                  />
                  {semesters.length > 1 && (
                    <button
                      onClick={() => removeSemester(semester.id)}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-all text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {semester.courses.length > 0 && (
                  <div className="mb-3 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-2 font-semibold text-gray-700">Course Name</th>
                          <th className="text-left py-2 px-2 font-semibold text-gray-700">Grade</th>
                          <th className="text-left py-2 px-2 font-semibold text-gray-700">Credits</th>
                          <th className="py-2 px-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.courses.map((course) => (
                          <tr key={course.id} className="border-b border-gray-100">
                            <td className="py-2 px-2">
                              <input
                                type="text"
                                value={course.name}
                                onChange={(e) => updateCourse(semester.id, course.id, "name", e.target.value)}
                                placeholder="Course name"
                                className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:border-indigo-500 outline-none"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <select
                                value={course.grade}
                                onChange={(e) => updateCourse(semester.id, course.id, "grade", e.target.value)}
                                className="w-full px-2 py-1 text-sm font-semibold text-gray-900 border border-gray-300 rounded focus:border-indigo-500 outline-none bg-white"
                              >
                                {getGradeOptions().map(grade => (
                                  <option key={grade} value={grade}>{grade}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                value={course.credits}
                                onChange={(e) => updateCourse(semester.id, course.id, "credits", e.target.value)}
                                min="0"
                                max="12"
                                step="0.5"
                                className="w-20 px-2 py-1 text-sm font-semibold text-gray-900 border border-gray-300 rounded focus:border-indigo-500 outline-none"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => duplicateCourse(semester.id, course.id)}
                                  className="px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded text-xs"
                                  title="Duplicate"
                                >
                                  📋
                                </button>
                                <button
                                  onClick={() => removeCourse(semester.id, course.id)}
                                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <button
                  onClick={() => addCourse(semester.id)}
                  className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all text-sm"
                >
                  + Add Course
                </button>

                {semester.courses.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Semester GPA:</span>
                      <span className="text-lg font-bold text-indigo-600">
                        {calculateSemesterGPA(semester.courses).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={addSemester}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all text-sm"
            >
              + Add Semester
            </button>
          </section>

          {/* Results */}
          <aside className="lg:sticky lg:top-6">
            {hasCourses ? (
              <>
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {hasPreviousGPA ? "New Cumulative GPA" : "Overall GPA"}
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-1">
                    {hasPreviousGPA ? finalCumulativeGPA.toFixed(2) : overallGPA.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Out of {selectedSystem === "custom" ? Number(customScale).toFixed(1) : currentSystem.scale}
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current GPA</span>
                      <span className="font-semibold text-gray-900">{overallGPA.toFixed(2)}</span>
                    </div>
                    {hasPreviousGPA && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Previous GPA</span>
                          <span className="font-semibold text-gray-900">{Number(cumulativeGPA).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">GPA Change</span>
                          <span className={`font-semibold ${finalCumulativeGPA - Number(cumulativeGPA) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {finalCumulativeGPA - Number(cumulativeGPA) >= 0 ? '+' : ''}
                            {(finalCumulativeGPA - Number(cumulativeGPA)).toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {targetResult && (
                    <div className={`mb-4 p-3 rounded-lg ${targetResult.isPossible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="text-xs font-semibold uppercase tracking-wide mb-1">
                        🎯 Target GPA: {targetGPA}
                      </div>
                      {targetResult.isPossible ? (
                        <>
                          <div className="text-lg font-bold text-green-700">
                            {targetResult.requiredGPA.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-700">
                            Required GPA for next {targetCredits} credits
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-red-700 font-semibold">
                          Target not achievable with {targetCredits} credits
                        </div>
                      )}
                    </div>
                  )}

                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Semester Breakdown</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                    {semesters.filter(s => s.courses.length > 0).map((semester) => {
                      const semGPA = calculateSemesterGPA(semester.courses);
                      const semCredits = semester.courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
                      return (
                        <div key={semester.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-900 text-sm">{semester.name}</span>
                            <span className="font-bold text-indigo-600 text-lg">{semGPA.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            {semester.courses.length} course{semester.courses.length !== 1 ? 's' : ''} • {semCredits} credits
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg text-xs text-gray-700">
                    <div className="font-semibold text-blue-900 mb-1">📘 {currentSystem.name}</div>
                    <div>Scale: {selectedSystem === "custom" ? customScale : currentSystem.scale}-point</div>
                  </div>
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
                <div className="text-4xl mb-2">🎓</div>
                <div className="text-gray-600 text-sm font-medium">
                  Add courses to calculate GPA
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
      {/* SEO Content Below Calculator */}
        <div className="mt-12 space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Use This GPA Calculator
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our comprehensive GPA calculator supports multiple international grading systems including US 4.0 scale, 
              Indian 10-point CGPA, UK degree classification, German 1-5 scale, and many more. Simply select your 
              grading system, add your courses with their grades and credit hours, and instantly see your semester 
              and cumulative GPA calculations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Perfect for high school students, college undergraduates, graduate students, and anyone tracking academic 
              performance across multiple semesters. The calculator handles weighted courses, honors classes, and lets 
              you project future GPA based on target grades. You can also create custom grading scales for institutions 
              with unique systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why Use Our GPA Calculator?
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Multiple Grading Systems:</strong> Support for 10+ international grading scales including US, India, UK, Germany, Canada, Australia, Singapore, France, Netherlands, and China.</p>
              <p><strong>Accurate Calculations:</strong> Properly weighted GPA calculations based on credit hours, ensuring precise semester and cumulative results.</p>
              <p><strong>Track Multiple Semesters:</strong> Add unlimited semesters and courses to track your academic progress throughout your entire degree program.</p>
              <p><strong>Cumulative GPA:</strong> Include your previous GPA and credits to calculate your updated cumulative GPA after new semesters.</p>
              <p><strong>Target GPA Calculator:</strong> Set a target GPA and see exactly what grades you need to achieve in upcoming courses to reach your goal.</p>
              <p><strong>Custom Grading Scales:</strong> Create your own grading system for schools or universities with unique grade point scales.</p>
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
                <span>Support for 10+ international grading systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Create custom grading scales for any institution</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Add unlimited semesters and courses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Credit-weighted GPA calculations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Calculate cumulative GPA with previous records</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Target GPA calculator for goal setting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Semester-by-semester breakdown</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Duplicate courses for easy data entry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Real-time GPA updates as you type</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Share results via text or social media</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Mobile-friendly responsive design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>100% free, no ads, works offline</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Supported Grading Systems
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>United States (4.0 Scale):</strong> Standard A-F letter grades with plus/minus variations. A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0.</p>
              <p><strong>India (10-Point CGPA):</strong> O (Outstanding) = 10, A+ (Excellent) = 9, A (Very Good) = 8, B+ (Good) = 7, commonly used in IITs, NITs, and most universities.</p>
              <p><strong>United Kingdom:</strong> First Class (70-100%), Upper Second 2:1 (60-69%), Lower Second 2:2 (50-59%), Third Class (40-49%), used for degree classifications.</p>
              <p><strong>Germany (1-5 Scale):</strong> Reverse scale where 1.0 is the best (Sehr gut) and 5.0 is fail (Nicht bestanden). Lower numbers are better grades.</p>
              <p><strong>Canada (4.0 Scale):</strong> Similar to US system with A+ to F letter grades, widely used across Canadian universities.</p>
              <p><strong>Australia (7-Point GPA):</strong> HD (High Distinction) = 7, D (Distinction) = 6, C (Credit) = 5, P (Pass) = 4, F = 0.</p>
              <p><strong>Singapore (5.0 Scale):</strong> A+ = 5.0, used in NUS, NTU, and other Singaporean institutions.</p>
              <p><strong>France (20-Point Scale):</strong> Très bien (18-20), Bien (16-18), Assez bien (14-16), traditional French grading system.</p>
              <p><strong>Netherlands (10-Point):</strong> 10 = Outstanding, 6 = Sufficient (passing grade), 1-5 = Fail.</p>
              <p><strong>China (Percentage to 4.0):</strong> 90-100 (优秀) = 4.0, 80-89 (良好) = 3.0, 70-79 (中等) = 2.0, 60-69 (及格) = 1.0.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Common Use Cases
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>College Applications:</strong> Calculate your GPA accurately for college admissions, scholarship applications, and university transfers.</p>
              <p><strong>Academic Planning:</strong> Track semester-by-semester performance to stay on top of your academic goals and degree requirements.</p>
              <p><strong>Scholarship Eligibility:</strong> Monitor your GPA to ensure you meet scholarship requirements and maintain academic standing.</p>
              <p><strong>Graduate School:</strong> Calculate cumulative GPA for graduate school applications, which often have minimum GPA requirements.</p>
              <p><strong>Dean's List Goals:</strong> Use the target GPA feature to see what grades you need to make the Dean's List or honors programs.</p>
              <p><strong>International Students:</strong> Convert grades from your home country's system to US GPA for study abroad or international applications.</p>
              <p><strong>Academic Probation:</strong> Track progress if you're on academic probation and need to raise your GPA to a minimum threshold.</p>
              <p><strong>Course Planning:</strong> Plan future course loads and predict how different grade scenarios will affect your overall GPA.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How GPA is Calculated
            </h2>
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded mb-3">
              <p className="text-gray-800 font-semibold mb-2">Basic GPA Formula:</p>
              <p className="text-gray-800 font-mono text-sm mb-3">
                GPA = (Sum of Grade Points × Credit Hours) ÷ Total Credit Hours
              </p>
              
              <p className="text-gray-800 font-semibold mb-2">Example Calculation:</p>
              <div className="text-gray-800 text-sm space-y-1">
                <p>Course 1: Grade A (4.0) × 3 credits = 12 points</p>
                <p>Course 2: Grade B (3.0) × 4 credits = 12 points</p>
                <p>Course 3: Grade A- (3.7) × 3 credits = 11.1 points</p>
                <p className="pt-2 border-t border-indigo-200">Total: 35.1 points ÷ 10 credits = <strong>3.51 GPA</strong></p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Each course grade is converted to grade points based on your grading system. These points are multiplied 
              by the course's credit hours to weight them appropriately. The sum of all weighted points is divided by 
              the total credit hours to get your GPA. This ensures that a 4-credit course has more impact on your GPA 
              than a 1-credit course.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Understanding Cumulative GPA
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>What is Cumulative GPA?</strong> Your cumulative GPA is the average of all grades you've received throughout your entire academic career, not just one semester.</p>
              <p><strong>How to Calculate:</strong> To find your new cumulative GPA, multiply your previous GPA by previous credit hours, add the new semester's grade points, then divide by total credit hours (previous + new).</p>
              <p><strong>Why It Matters:</strong> Cumulative GPA is what appears on transcripts and is used for graduation requirements, honors, scholarships, and graduate school admissions.</p>
              <p><strong>Semester vs Cumulative:</strong> Semester GPA shows your performance in just one term, while cumulative GPA reflects your overall academic record across all terms.</p>
              <p><strong>Improving Cumulative GPA:</strong> It becomes harder to change cumulative GPA as you progress through school since you have more total credits. Early semesters have the biggest impact.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Tips for Improving Your GPA
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">1.</span>
                <span><strong>Prioritize High-Credit Courses:</strong> Focus extra effort on courses worth more credits since they have a bigger impact on your GPA.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">2.</span>
                <span><strong>Use the Target GPA Feature:</strong> Set realistic goals and see exactly what grades you need to achieve them, helping you prioritize study time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">3.</span>
                <span><strong>Start Strong:</strong> Your first semesters have the most impact on cumulative GPA when you have fewer total credits.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">4.</span>
                <span><strong>Retake Failed Courses:</strong> Many schools allow grade replacement where retaking a course replaces the old grade in GPA calculations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">5.</span>
                <span><strong>Balance Course Load:</strong> Don't overload difficult courses in one semester. Mix challenging courses with easier ones to maintain grades.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">6.</span>
                <span><strong>Attend Office Hours:</strong> Professors often give hints about exams and can clarify difficult concepts, leading to better grades.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">7.</span>
                <span><strong>Track Progress Regularly:</strong> Use this calculator throughout the semester to stay aware of your standing and adjust study habits as needed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">8.</span>
                <span><strong>Consider Pass/Fail Options:</strong> For electives outside your major, pass/fail grading can protect your GPA if allowed by your school.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              GPA Scale Conversions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Letter Grade</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">4.0 Scale</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Percentage</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-2 font-semibold">A+ / A</td>
                    <td className="px-4 py-2">4.0</td>
                    <td className="px-4 py-2">93-100%</td>
                    <td className="px-4 py-2">Excellent</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">A-</td>
                    <td className="px-4 py-2">3.7</td>
                    <td className="px-4 py-2">90-92%</td>
                    <td className="px-4 py-2">Excellent</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">B+</td>
                    <td className="px-4 py-2">3.3</td>
                    <td className="px-4 py-2">87-89%</td>
                    <td className="px-4 py-2">Good</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">B</td>
                    <td className="px-4 py-2">3.0</td>
                    <td className="px-4 py-2">83-86%</td>
                    <td className="px-4 py-2">Good</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">B-</td>
                    <td className="px-4 py-2">2.7</td>
                    <td className="px-4 py-2">80-82%</td>
                    <td className="px-4 py-2">Good</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">C+</td>
                    <td className="px-4 py-2">2.3</td>
                    <td className="px-4 py-2">77-79%</td>
                    <td className="px-4 py-2">Satisfactory</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">C</td>
                    <td className="px-4 py-2">2.0</td>
                    <td className="px-4 py-2">73-76%</td>
                    <td className="px-4 py-2">Satisfactory</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">C-</td>
                    <td className="px-4 py-2">1.7</td>
                    <td className="px-4 py-2">70-72%</td>
                    <td className="px-4 py-2">Satisfactory</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">D+</td>
                    <td className="px-4 py-2">1.3</td>
                    <td className="px-4 py-2">67-69%</td>
                    <td className="px-4 py-2">Poor</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">D</td>
                    <td className="px-4 py-2">1.0</td>
                    <td className="px-4 py-2">63-66%</td>
                    <td className="px-4 py-2">Poor</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 font-semibold">F</td>
                    <td className="px-4 py-2">0.0</td>
                    <td className="px-4 py-2">0-62%</td>
                    <td className="px-4 py-2">Failing</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm mt-3 italic">
              Note: Exact percentage ranges may vary by institution. Always check your school's specific grading policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              GPA Requirements for Common Goals
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Dean's List:</strong> Typically requires 3.5-3.7 GPA for semester honors recognition at most universities.</p>
              <p><strong>Cum Laude (with honors):</strong> Usually 3.5-3.7 cumulative GPA for undergraduate degree honors.</p>
              <p><strong>Magna Cum Laude:</strong> Generally 3.7-3.9 cumulative GPA for high honors at graduation.</p>
              <p><strong>Summa Cum Laude:</strong> Typically 3.9-4.0 cumulative GPA for highest honors distinction.</p>
              <p><strong>Graduate School:</strong> Most programs require minimum 3.0 GPA, competitive programs want 3.5+.</p>
              <p><strong>Medical School:</strong> Highly competitive, usually requires 3.7+ overall GPA and 3.5+ science GPA.</p>
              <p><strong>Law School:</strong> Top tier schools typically require 3.8+ GPA along with high LSAT scores.</p>
              <p><strong>MBA Programs:</strong> Top business schools prefer 3.5+ GPA combined with work experience and GMAT scores.</p>
              <p><strong>Scholarships:</strong> Merit-based scholarships often require maintaining 3.0-3.5 GPA depending on the award.</p>
              <p><strong>Academic Probation:</strong> Students usually go on probation if GPA falls below 2.0, with risk of dismissal if it doesn't improve.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What is a good GPA?</h3>
                <p className="text-gray-700">A 3.0 GPA (B average) is generally considered good, 3.5+ is very good, and 3.7+ is excellent. However, "good" depends on your goals - graduate school may require higher GPAs than simply graduating.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do I convert my GPA to a different scale?</h3>
                <p className="text-gray-700">Select your current grading system in the calculator, enter your courses, then switch to the target grading system to see the equivalent. Different countries have different scales, so direct conversion isn't always perfect.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Does GPA round up?</h3>
                <p className="text-gray-700">GPA is typically reported to two decimal places (e.g., 3.46) and is not rounded up on official transcripts. A 3.49 remains 3.49, not 3.5. However, some scholarships or programs may have their own rounding policies.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can I calculate weighted GPA for honors or AP classes?</h3>
                <p className="text-gray-700">Use the Custom Scale feature to create a weighted system where honors/AP classes receive extra points (e.g., A = 5.0 instead of 4.0). Add those courses with the higher point values.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How accurate is the target GPA calculator?</h3>
                <p className="text-gray-700">The target GPA calculator is mathematically accurate, showing exactly what GPA you need in future courses. However, it assumes you'll complete the specified credit hours and doesn't account for withdrawals or grade changes.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Should I include failed courses in GPA calculation?</h3>
                <p className="text-gray-700">Yes, failed courses (F grades) count as 0.0 and must be included in GPA calculations. They negatively impact your GPA. Check if your school allows grade replacement if you retake the course.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What's the difference between semester and cumulative GPA?</h3>
                <p className="text-gray-700">Semester GPA is your average for just one term. Cumulative GPA is the average of all your grades across all semesters combined. Cumulative GPA appears on transcripts and is used for graduation.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Can I save my GPA calculations?</h3>
                <p className="text-gray-700">Currently, calculations are not saved automatically for privacy. You can bookmark the page and manually re-enter data, or use the share function to send results to yourself for record-keeping.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do pass/fail courses affect GPA?</h3>
                <p className="text-gray-700">Pass/fail courses typically don't affect GPA at all - they don't count in the calculation but the credits still count toward degree requirements. Check your specific institution's policy.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Is this calculator suitable for high school GPA?</h3>
                <p className="text-gray-700">Yes! The calculator works for both high school and college. For weighted high school GPA with honors/AP classes, use the Custom Scale feature to add extra grade points for advanced courses.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Academic Success Tips
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Create a Study Schedule:</strong> Consistent study habits are more effective than cramming. Allocate specific times for each course based on difficulty and credit hours.</p>
              <p><strong>Understand Grade Weights:</strong> Know how your final grade is calculated - exams, homework, projects, participation. Focus effort where it counts most.</p>
              <p><strong>Form Study Groups:</strong> Collaborative learning helps reinforce concepts and can make studying more enjoyable and effective.</p>
              <p><strong>Use Professor Resources:</strong> Office hours, review sessions, and posted materials are free resources that can significantly improve your understanding.</p>
              <p><strong>Stay Organized:</strong> Track assignment deadlines, exam dates, and project milestones. Missing deadlines can tank your grade even if you know the material.</p>
              <p><strong>Take Care of Your Health:</strong> Adequate sleep, exercise, and nutrition directly impact cognitive function and academic performance.</p>
              <p><strong>Seek Help Early:</strong> Don't wait until you're failing to get help. Visit tutoring centers, join study groups, or hire a tutor at the first sign of struggle.</p>
              <p><strong>Manage Your Time:</strong> Balance academics with extracurriculars and social life. Burnout hurts GPA more than missing a few social events.</p>
            </div>
          </section>
        </div>
    </main>
  );
}