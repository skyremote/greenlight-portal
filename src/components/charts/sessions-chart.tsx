"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SessionsChartProps {
  meetings: Array<{ date: string }>;
}

export function SessionsChart({ meetings }: SessionsChartProps) {
  // Group meetings by month
  const monthCounts = new Map<string, number>();

  for (const m of meetings) {
    if (!m.date) continue;
    const d = new Date(m.date + "T00:00:00");
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
  }

  // Get last 6 months
  const now = new Date();
  const data: Array<{ month: string; sessions: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-GB", { month: "short" });
    data.push({
      month: label,
      sessions: monthCounts.get(key) || 0,
    });
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-base font-semibold text-gray-100 mb-4">
        Sessions per Month
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(20,20,20,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                borderRadius: "8px",
                color: "#e5e7eb",
                fontSize: "13px",
              }}
            />
            <Bar
              dataKey="sessions"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
