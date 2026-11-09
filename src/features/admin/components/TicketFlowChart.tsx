import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  RevenueTimelineResponse,
  TicketFlowResponse,
} from "../types/admin.types";
import { formatCompactNumber, formatThousands } from "../utils/adminFormatters";

interface TicketFlowChartProps {
  data: TicketFlowResponse[];
  revenueTimeline?: RevenueTimelineResponse[];
}

interface TicketOrderChartItem {
  period: string;
  issuedTickets: number;
  ordersCount: number;
}

export default function TicketFlowChart({
  data,
  revenueTimeline = [],
}: TicketFlowChartProps) {
  const chartData: TicketOrderChartItem[] = data.map((item, index) => ({
    period: item.period,
    issuedTickets: item.issuedTickets,
    ordersCount:
      revenueTimeline.find((r) => r.period === item.period)?.ordersCount ??
      revenueTimeline[index]?.ordersCount ??
      0,
  }));

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">
            Tickets Emitidos vs. Órdenes
          </h3>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            Comparativa mensual entre entradas generadas y órdenes procesadas
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-on-surface-variant shrink-0">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#3525cd]" />
            Tickets
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#a8b3f8]" />
            Órdenes
          </span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="w-full h-64 sm:h-72 flex items-center justify-center text-xs text-on-surface-variant font-medium">
          No existen registros para mostrar el flujo de tickets y órdenes.
        </div>
      ) : (
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 16, right: 12, left: -16, bottom: 0 }}
            >
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
                  val === 0 ? "0" : formatCompactNumber(val)
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as TicketOrderChartItem;
                    return (
                      <div className="bg-inverse-surface text-inverse-on-surface px-3 py-2 rounded-xl text-xs shadow-lg border border-outline/20 space-y-1">
                        <p className="font-semibold text-slate-300">{item.period}</p>
                        <p className="font-bold text-white">
                          Tickets emitidos: {formatThousands(item.issuedTickets)}
                        </p>
                        <p className="font-semibold text-indigo-200">
                          Órdenes procesadas: {formatThousands(item.ordersCount)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="issuedTickets"
                name="Tickets"
                fill="#3525cd"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="ordersCount"
                name="Órdenes"
                fill="#a8b3f8"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

