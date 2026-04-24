"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Row = {
  date: string;
  dow: string;
  target: number;
  reservation: number;
  actualRes: number;
};

export function DailyChart({ data }: { data: Row[] }) {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <div className="label-caps text-ink-secondary">Daily Trend</div>
        <h3 className="text-base font-semibold text-ink mt-1">
          日次推移 — 予約目標 vs 実予約
        </h3>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#242429" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                background: "#111114",
                border: "1px solid #33333b",
                borderRadius: 6,
                fontSize: 12,
              }}
              labelStyle={{ color: "#fafafa", fontWeight: 600 }}
              itemStyle={{ color: "#a1a1aa" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="square"
              iconSize={8}
            />
            <Bar dataKey="target" fill="#33333b" name="予約目標" radius={[2, 2, 0, 0]} />
            <Bar
              dataKey="reservation"
              fill="#71717a"
              name="総予約"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="actualRes"
              fill="#F5A524"
              name="実予約"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
