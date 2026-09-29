import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyTicketData } from "../types/admin.types";
import { formatThousands } from "../utils/adminFormatters";

interface MonthlyTicketsChartProps {
  data: MonthlyTicketData[];
}

export default function MonthlyTicketsChart({ data }: MonthlyTicketsChartProps) {
  // Gradiente de tonos lavanda a índigo intenso como en la maqueta
  const getBarColor = (entry: MonthlyTicketData, index: number) => {
    if (entry.highlight) return "#3525cd"; // Mayo destacado
    const palette = [
      "#d5d9fb", // Ene
      "#c2c9fa", // Feb
      "#a8b3f8", // Mar
      "#6f7cf0", // Abr
      "#3525cd", // May
      "#5c68ea", // Jun
    ];
    return palette[index] || "#a8b3f8";
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">
            Entradas Emitidas por Mes
          </h3>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            Volumen mensual de emisión (Semestre 2024-I)
          </p>
        </div>
        <div className="px-3 py-1 bg-surface-container-high/60 rounded-lg text-xs font-semibold text-on-surface-variant shrink-0">
          Ene - Jun
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaedff" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#777587" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#777587" }}
              domain={[0, 2200]}
              ticks={[0, 1000, 1500, 2000]}
              tickFormatter={(val: number) => (val === 0 ? "0" : val.toLocaleString())}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as MonthlyTicketData;
                  return (
                    <div className="bg-inverse-surface text-inverse-on-surface px-3 py-2 rounded-xl text-xs shadow-lg border border-outline/20">
                      <p className="font-semibold text-slate-300">{item.month} 2024</p>
                      <p className="font-bold text-sm text-white mt-0.5">
                        {formatThousands(item.tickets)} entradas
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="tickets" radius={[6, 6, 0, 0]} maxBarSize={38}>
              <LabelList
                dataKey="displayLabel"
                position="top"
                fill="#777587"
                fontSize={11}
                fontWeight={600}
                offset={8}
              />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry, index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
