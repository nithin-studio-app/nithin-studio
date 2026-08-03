import {
  Card,
  CardContent,
  CardHeader,
  CheckIcon,
  ErrorIcon,
  HelpIcon,
  ProgressBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  WarningIcon,
} from "@nithin-studio-app/ui-components";
import type { ReactNode } from "react";
import { apps } from "./apps";
import type { RegisteredService } from "./serviceRegistryContext";
import { useServiceRegistry } from "./serviceRegistryContext";
import "./DashboardPage.css";

interface Gauge {
  label: string;
  available: number;
  total: number;
}

function availabilityPct(gauge: Gauge): number {
  return gauge.total === 0 ? 0 : (gauge.available / gauge.total) * 100;
}

interface StatusRow {
  name: string;
  base_url?: string;
  status: "healthy" | "down" | "not-registered" | "unknown";
}

const STATUS_LABEL: Record<StatusRow["status"], string> = {
  healthy: "Healthy",
  down: "Down",
  "not-registered": "Not registered",
  unknown: "Can't reach gatekeeper-api",
};
const STATUS_COLOR: Record<StatusRow["status"], string> = {
  healthy: "#64dd17",
  down: "#ff5252",
  "not-registered": "#9aa0a6",
  unknown: "#f5b342",
};
const STATUS_ICON: Record<StatusRow["status"], ReactNode> = {
  healthy: <CheckIcon />,
  down: <ErrorIcon />,
  "not-registered": <HelpIcon />,
  unknown: <WarningIcon />,
};

function toRows(entries: [string, RegisteredService][]): StatusRow[] {
  return entries.map(([, service]) => ({ name: service.title, base_url: service.base_url, status: service.status }));
}

const MAX_ROWS = 5;

function StatusTable({ rows, connected }: { rows: StatusRow[]; connected: boolean }) {
  if (rows.length === 0) {
    return !connected ? (
      <Text variant="body2" color="#f5b342">
        Can't reach gatekeeper-api.
      </Text>
    ) : (
      <Text variant="body2" color="#9aa0a6">
        Nothing here yet.
      </Text>
    );
  }
  const visibleRows = rows.slice(0, MAX_ROWS);
  const hiddenCount = rows.length - visibleRows.length;

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell header>Name</TableCell>
            <TableCell header>Base URL</TableCell>
            <TableCell header align="right">
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.base_url ?? "—"}</TableCell>
              <TableCell align="right">
                <span
                  className="dashboard-status-icon"
                  style={{ color: STATUS_COLOR[row.status] }}
                  role="img"
                  aria-label={STATUS_LABEL[row.status]}
                  title={STATUS_LABEL[row.status]}
                >
                  {STATUS_ICON[row.status]}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {hiddenCount > 0 && (
        <Text variant="body2" color="#9aa0a6">
          +{hiddenCount} more
        </Text>
      )}
    </>
  );
}

export function DashboardPage() {
  const { registry, connected } = useServiceRegistry();
  const registryEntries = Object.entries(registry).sort(([a], [b]) => a.localeCompare(b));
  const apiEntries = registryEntries.filter(([, service]) => service.kind === "api");
  const infraEntries = registryEntries.filter(([, service]) => service.kind === "infra");

  const appRows: StatusRow[] = apps.map((app) => {
    const entry = app.backendServiceName ? registry[app.backendServiceName] : undefined;
    const status = !connected ? "unknown" : (entry?.status ?? "not-registered");
    return { name: app.name, base_url: entry?.base_url, status };
  });

  const sections = [
    { label: "Apps", rows: appRows },
    { label: "Services", rows: toRows(registryEntries) },
    { label: "API modules", rows: toRows(apiEntries) },
    { label: "Infra modules", rows: toRows(infraEntries) },
  ];

  const gauges: Gauge[] = sections.map((section) => ({
    label: section.label,
    total: section.rows.length,
    available: section.rows.filter((row) => row.status === "healthy").length,
  }));

  return (
    <div className="dashboard-page">
      <Text variant="h4">Dashboard</Text>

      {!connected && (
        <Text variant="body2" color="#f5b342">
          Can't reach gatekeeper-api — check it (and its Redis) are running. Statuses below are unknown, not down.
        </Text>
      )}

      <Card variant="outlined">
        <CardContent>
          <div className="dashboard-gauges">
            {gauges.map((gauge) => (
              <div className="dashboard-gauge" key={gauge.label}>
                <ProgressBar variant="gauge" pct={availabilityPct(gauge)} showLabel aria-label={`${gauge.label} available`} />
                <Text variant="body2" color="#9aa0a6">
                  {gauge.label} ({gauge.available}/{gauge.total})
                </Text>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="dashboard-section-grid">
        {sections.map((section) => (
          <Card variant="outlined" key={section.label}>
            <CardHeader title={section.label} />
            <CardContent>
              <StatusTable rows={section.rows} connected={connected} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
