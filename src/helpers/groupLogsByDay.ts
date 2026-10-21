import type { ActivityLog } from "../types/activity-logs.types";
import { dayLabel } from "./dayLabel";

export const parseLogDate = (value: string) => new Date(value.replace(" ", "T"));

export function groupLogsByDay(logs: ActivityLog[] = []) {
  const sorted = [...logs].sort(
    (a, b) => parseLogDate(b.createdAt).getTime() - parseLogDate(a.createdAt).getTime()
  );

  const groups: { label: string; items: ActivityLog[] }[] = [];
  for (const log of sorted) {
    const label = dayLabel(parseLogDate(log.createdAt));
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(log);
    else groups.push({ label, items: [log] });
  }
  return groups;
}