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
import type { DailyRow } from "@/lib/dashboard-data";
import { numOr0 } from "@/lib/config";

type ChartRow = {
  date: string;
  dow: string;
  target: number;
  reservation: number;
  actualRes: number;
};

export function DailyChart({ data }: { data: DailyRow[] }) {
  const rows: ChartRow[] = data.map((r) => ({
    date: r.date,
    dow: r.dow,
    target: numOr0(r.target.value),
    reservation: numOr0(r.reservation.value),
    actualRes: numOr0(r.actualRes.value),
  }));

  return (
    <div className="panel p-2">
      <h3 className="display-serif text-sm text-ink leading-tight mb-1">
        日次推移 — 予約目標 vs 実予約
      </h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart
            data={rows}
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#E7E5E4"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#737373"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#737373"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(13,125,114,0.04)" }}
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #E7E5E4",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
              labelStyle={{ color: "#0A0A0A", fontWeight: 600 }}
              itemStyle={{ color: "#525252" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="square"
              iconSize={8}
            />
            <Bar
              dataKey="target"
              fill="#D6D3D1"
              name="予約目標"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="reservation"
              fill="#A3A3A3"
              name="総予約"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="actualRes"
              fill="#0D7D72"
              name="実予約"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
