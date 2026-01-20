"use client";

type BreakdownItem = {
  label: string;
  value: string;
};

type ResultCardProps = {
  title: string;
  mainValue: string;
  context?: string;
  breakdown?: BreakdownItem[];
  insight?: string;
};

export default function ResultCard({
  title,
  mainValue,
  context,
  breakdown,
  insight,
}: ResultCardProps) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginTop: 20 }}>
      <h2>{title}</h2>
      <h1>{mainValue}</h1>

      {context && <p>{context}</p>}

      {breakdown &&
        breakdown.map((item, idx) => (
          <div key={idx}>
            {item.label}: {item.value}
          </div>
        ))}

      {insight && <strong>{insight}</strong>}
    </div>
  );
}