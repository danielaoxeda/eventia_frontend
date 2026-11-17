import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenueTimelineResponse } from "../types/admin.types";
import {
  formatCompactCurrency,
  formatCurrency,
  formatThousands,
} from "../utils/adminFormatters";

interface RevenueTimelineChartProps {
  data: RevenueTimelineResponse[];
}

export default function RevenueTimelineChart({ data }: RevenueTimelineChartProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">
            Ingresos Históricos
          </h3>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            Evolución de recaudación según órdenes procesadas
          </p>
        </div>
        <div className="px-3 py-1 bg-surface-container-high/60 rounded-lg text-xs font-semibold text-on-surface-variant shrink-0">
          {data.length > 0
            ? `${data[0].period} - ${data[data.length - 1].period}`
            : "Sin registros"}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="w-full h-64 sm:h-72 flex items-center justify-center text-xs text-on-surface-variant font-medium">
          No existen órdenes registradas para mostrar ingresos históricos.
        </div>
      ) : (
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3525cd" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#3525cd" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaedff" />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#777587" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#777587" }}
                tickFormatter={(val: number) =>
                  val === 0 ? "S/ 0" : formatCompactCurrency(val)
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as RevenueTimelineResponse;
                    return (
                      <div className="bg-inverse-surface text-inverse-on-surface px-3 py-2 rounded-xl text-xs shadow-lg border border-outline/20">
                        <p className="font-semibold text-slate-300">{item.period}</p>
                        <p className="font-bold text-sm text-white mt-0.5">
                          {formatCurrency(item.revenue)}
                        </p>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {formatThousands(item.ordersCount)} órdenes procesadas
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3525cd"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

