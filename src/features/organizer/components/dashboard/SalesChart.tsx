import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { DailySalesDataPoint, ZoneDistributionDataPoint } from "../../types/organizer.types";
import { formatPEN, formatNumber } from "../../utils/organizerFormatters";

interface SalesChartProps {
  dailySales: DailySalesDataPoint[];
  zoneDistribution: ZoneDistributionDataPoint[];
}

export default function SalesChart({
  dailySales,
  zoneDistribution,
}: SalesChartProps) {
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");

  const totalPeriodRevenue = dailySales.reduce((acc, curr) => acc + curr.totalPEN, 0);
  const totalPeriodTickets = dailySales.reduce((acc, curr) => acc + curr.ticketsSold, 0);

  // Formatter para tooltip interactivo
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DailySalesDataPoint = payload[0].payload;
      return (
        <div className="bg-surface-container-lowest p-3 rounded-lg shadow-lg border border-outline-variant/30 text-xs flex flex-col gap-1.5">
          <p className="font-bold text-on-surface">
            {data.day} ({data.date})
          </p>
          <div className="flex items-center justify-between gap-4 text-primary font-bold">
            <span>Recaudación:</span>
            <span>{formatPEN(data.totalPEN, false)}</span>
          </div>
          <div className="pt-1 border-t border-surface-container flex items-center justify-between gap-4 text-outline text-[11px]">
            <span>Tickets vendidos:</span>
            <span className="font-semibold text-on-surface">{formatNumber(data.ticketsSold)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main Evolution Chart */}
      <div className="xl:col-span-2 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[0.6875rem] font-bold text-outline uppercase tracking-wider">
                MONITOREO EN TIEMPO REAL
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-on-surface">
              Evolución de Ventas y Recaudación
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <div className="bg-surface-container p-0.5 rounded-lg flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChartType("area")}
                className={`px-2.5 py-1 rounded-md transition-colors ${chartType === "area"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
                  }`}
              >
                Área
              </button>
              <button
                type="button"
                onClick={() => setChartType("bar")}
                className={`px-2.5 py-1 rounded-md transition-colors ${chartType === "bar"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
                  }`}
              >
                Barras
              </button>
            </div>

            <div className="bg-surface-container p-0.5 rounded-lg flex items-center text-xs font-medium">
              <button
                type="button"
                onClick={() => setTimeRange("7d")}
                className={`px-2.5 py-1 rounded-md transition-colors ${timeRange === "7d"
                  ? "bg-surface-container-lowest text-on-surface font-semibold shadow-xs"
                  : "text-on-surface-variant"
                  }`}
              >
                7 días
              </button>
              <button
                type="button"
                onClick={() => setTimeRange("30d")}
                className={`px-2.5 py-1 rounded-md transition-colors ${timeRange === "30d"
                  ? "bg-surface-container-lowest text-on-surface font-semibold shadow-xs"
                  : "text-on-surface-variant"
                  }`}
              >
                30 días
              </button>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={dailySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalSalesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3525cd" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3525cd" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaedff" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#777587", fontSize: 12 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#777587", fontSize: 11 }}
                  tickFormatter={(val) => `S/ ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="totalPEN"
                  name="Recaudación (PEN)"
                  stroke="#3525cd"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#totalSalesGradient)"
                />
              </AreaChart>
            ) : (
              <BarChart data={dailySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaedff" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#777587", fontSize: 12 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#777587", fontSize: 11 }}
                  tickFormatter={(val) => `S/ ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalPEN" name="Recaudación (PEN)" fill="#3525cd" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend / Summary Footer */}
        <div className="mt-4 pt-3 border-t border-surface-container flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-on-surface-variant font-medium">
              Ventas Consolidadas del período ({formatNumber(totalPeriodTickets)} tickets)
            </span>
          </div>
          <div className="text-outline">
            Recaudación período:{" "}
            <strong className="text-on-surface font-semibold">
              {formatPEN(totalPeriodRevenue, false)}
            </strong>
          </div>
        </div>
      </div>

      {/* Side Breakdown: Zones & Capacity */}
      <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[0.6875rem] font-bold text-outline uppercase tracking-wider">
              AFORO Y RECAUDACIÓN
            </span>
          </div>
          <h3 className="font-display text-base font-bold text-on-surface mb-3">
            Ocupación por Zonas
          </h3>

          <div className="space-y-4">
            {zoneDistribution.map((zone) => (
              <div key={zone.zoneName} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-on-surface">{zone.zoneName}</span>
                  <span className="font-bold text-primary">{zone.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${zone.percentage}%`,
                      backgroundColor: zone.color,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-outline">
                  <span>{formatNumber(zone.soldCount)} emitidas</span>
                  <span>Capacidad: {formatNumber(zone.totalCapacity)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
