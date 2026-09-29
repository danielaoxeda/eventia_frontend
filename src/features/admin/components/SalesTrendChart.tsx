import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SalesDataPoint } from "../types/admin.types";
import { formatPEN } from "../utils/adminFormatters";

interface SalesTrendChartProps {
  data: SalesDataPoint[];
}

export default function SalesTrendChart({ data }: SalesTrendChartProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">
            Ingresos por Ventas en el Tiempo
          </h3>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            Serie diaria acumulada (Últimos 30 días)
          </p>
        </div>
        <div className="px-3 py-1 bg-surface-container-high/60 rounded-lg text-xs font-semibold text-on-surface-variant shrink-0">
          Mayo 2024
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3525cd" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3525cd" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaedff" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#777587" }}
              interval="preserveStartEnd"
              ticks={["Día 1", "Día 5", "Día 10", "Día 15", "Día 20", "Día 25", "Día 30"]}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#777587" }}
              domain={[0, 6500]}
              ticks={[0, 2000, 4000, 6000]}
              tickFormatter={(val: number) =>
                val === 0 ? "S/ 0" : `S/ ${Math.round(val / 1000)}k`
              }
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as SalesDataPoint;
                  return (
                    <div className="bg-inverse-surface text-inverse-on-surface px-3 py-2 rounded-xl text-xs shadow-lg border border-outline/20">
                      <p className="font-semibold text-slate-300">{item.day}</p>
                      <p className="font-bold text-sm text-white mt-0.5">
                        {formatPEN(item.ingresos)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#3525cd"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#salesGradient)"
              dot={{ r: 3, fill: "#3525cd", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#3525cd", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
