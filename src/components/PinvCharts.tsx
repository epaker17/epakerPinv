// src/components/PinvCharts.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Przykładowe dane. Zamień na własne źródło!
const sampleData = [
  { date: "01-07", price: 0.10 },
  { date: "02-07", price: 0.13 },
  { date: "03-07", price: 0.18 },
  { date: "04-07", price: 0.15 },
  { date: "05-07", price: 0.17 },
  { date: "06-07", price: 0.14 },
  { date: "07-07", price: 0.16 },
];

export default function PinvCharts() {
  return (
    <div
      style={{
        margin: "38px auto 0 auto",
        maxWidth: 650,
        width: "96vw",
        background: "rgba(20,33,61,0.80)",
        borderRadius: 20,
        boxShadow: "0 2px 20px #0002",
        padding: 28,
        color: "#FFD700"
      }}
    >
      <h2 style={{ color: "#FFD700", textAlign: "center", fontWeight: 700, marginBottom: 10 }}>
        PINV Token Price (Demo Data)
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={sampleData}>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#FFD700", fontSize: 13, fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: "#FFD70022" }}
          />
          <YAxis
            tickFormatter={v => "$" + v.toFixed(2)}
            tick={{ fill: "#FFD700", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#111f35",
              border: "1.5px solid #FFD700",
              color: "#FFD700"
            }}
            formatter={value =>
              "$" + Number(value).toLocaleString("en-US", { maximumFractionDigits: 4 })
            }
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#FFD700"
            strokeWidth={3}
            dot={{ r: 2 }}
            activeDot={{ r: 5, fill: "#FFD700" }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ fontSize: 13, color: "#ffd70099", marginTop: 12, textAlign: "center" }}>
        Demo chart – real data integration coming soon!
      </div>
    </div>
  );
}
