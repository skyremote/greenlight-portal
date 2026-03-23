"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ActionsChartProps {
  completed: number;
  pending: number;
}

const COLORS = ["#22c55e", "#555"];

export function ActionsChart({ completed, pending }: ActionsChartProps) {
  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  const total = completed + pending;

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-base font-semibold text-gray-100 mb-4">
        Actions Overview
      </h3>
      <div className="h-[250px] relative">
        {total === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500">No action items yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
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
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-gray-300 text-sm">{value}</span>
                )}
              />

              {/* Center text */}
              <text
                x="50%"
                y="42%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-100"
                style={{ fontSize: "24px", fontFamily: "var(--font-heading)" }}
              >
                {total}
              </text>
              <text
                x="50%"
                y="52%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-500"
                style={{ fontSize: "11px" }}
              >
                total
              </text>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
