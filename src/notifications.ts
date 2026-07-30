export type LogLevel = "info" | "warning" | "error";

export interface LogEntry {
  id: number;
  level: LogLevel;
  source: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Placeholder data — there's no backend yet (frontend first, per plan), so
// this stands in for the real activity/alerts feed until one exists.
export const mockLogEntries: LogEntry[] = [
  {
    id: 3,
    level: "error",
    source: "file-manager",
    message: "Upload failed: connection reset.",
    createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
    read: false,
  },
  {
    id: 2,
    level: "warning",
    source: "lora-trainer",
    message: "Training job queued longer than expected.",
    createdAt: new Date(Date.now() - 20 * 60_000).toISOString(),
    read: false,
  },
  {
    id: 1,
    level: "info",
    source: "image-generator",
    message: "Session started.",
    createdAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    read: true,
  },
];
