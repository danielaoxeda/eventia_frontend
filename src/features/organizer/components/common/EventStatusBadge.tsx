import type { EventStatus } from "../../types/organizer.types";
import { getStatusConfig } from "../../utils/organizerFormatters";

interface EventStatusBadgeProps {
  status: EventStatus;
  active?: boolean;
}

export default function EventStatusBadge({ status, active = true }: EventStatusBadgeProps) {
  const config = getStatusConfig(status, active);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.badgeClass}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  );
}
