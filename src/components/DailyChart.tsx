"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

type Row = { date: string; dow: string; target: number; reservation: number; actualRes: number };

export function DailyChart({ data }: { data: Row[] }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-200 mb-4">日次推移（予約目標 vs 実予約）</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
              labelStyle={{ color: "#e2e8f0" }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="target" fill="#475569" name="予約目標" />
            <Bar dataKey="reservation" fill="#3b82f6" name="総予約" />
            <Bar dataKey="actualRes" fill="#10b981" name="実予約" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
