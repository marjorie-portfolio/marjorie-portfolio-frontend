// activity-logs.types.ts
export type ActivityAction = "CREATED" | "UPDATED" | "DELETED";

export type ActivityLog = {
  id: number;
  action: ActivityAction;
  entity: string;
  entityId: number;
  label: string;
  createdAt: string; // ISO, e.g. "2026-10-19T07:12:46.208Z"
};

export type ActivityLogGroup = {
  date: string; // e.g. "October 19, 2026"
  items: ActivityLog[];
};