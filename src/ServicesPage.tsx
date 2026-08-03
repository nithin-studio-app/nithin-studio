import { Card, CardActions, CardContent, CardHeader, Chip, Divider, Text } from "@nithin-studio-app/ui-components";
import { useServiceRegistry } from "./serviceRegistryContext";
import type { RegisteredService } from "./serviceRegistryContext";
import { StatusDot } from "./StatusDot";
import "./ServicesPage.css";

const STATUS_LABEL = { healthy: "Healthy", down: "Unreachable" } as const;
// Same colors as StatusDot.css's --healthy/--down, so the port badge reads
// as the same signal as the dot up top rather than a second, uncoordinated
// color scheme.
const STATUS_COLOR = { healthy: "#64dd17", down: "#ff5252" } as const;

// Keyed by registry key (the stable id, not the display title) — same
// reasoning as SERVICE_TITLE: a future rename only ever touches the
// service's own title, never this lookup's key.
const SERVICE_DESCRIPTIONS: Record<string, string> = {
  "filezilla-api": "Stores and organizes uploaded files, folders, and preview thumbnails for filezilla.",
  "ledger-service": "Shared Postgres + MinIO gateway every app's own data ultimately flows through.",
  "media-importer-api": "Extracts images and videos from pasted URLs and imports them into filezilla.",
  postgres: "Relational database backing every app's own tables, reached only via ledger-service.",
  minio: "S3-compatible object storage for uploaded files and generated previews.",
  redis: "Backs gatekeeper-api's own live service registry and heartbeat tracking.",
};

const DEFAULT_DESCRIPTION = "No description available.";

// Not every base_url is a real URL (e.g. redis's is a plain descriptive
// string, since it has none of its own) — parses one only when it
// actually is, rather than guessing a port that isn't there.
function extractPort(baseUrl: string): string | null {
  try {
    return new URL(baseUrl).port || null;
  } catch {
    return null;
  }
}

function ServiceCard({ name, service }: { name: string; service: RegisteredService }) {
  const port = extractPort(service.base_url);
  return (
    <Card key={name} variant="outlined">
      <CardHeader
        title={<span className="services-card-title">{service.title}</span>}
        action={<StatusDot status={service.status} label={STATUS_LABEL[service.status]} />}
      />
      <div className="services-card-divider">
        <Divider inset />
      </div>
      <CardContent>
        <Text variant="body2" color="#9aa0a6">
          {SERVICE_DESCRIPTIONS[name] ?? DEFAULT_DESCRIPTION}
        </Text>
      </CardContent>
      {port && (
        <CardActions>
          <Chip label={`Port: ${port}`} variant="outlined" color={STATUS_COLOR[service.status]} />
        </CardActions>
      )}
    </Card>
  );
}

// Raw view of gatekeeper-api's registry — every backend process that has
// ever registered, regardless of whether it has a UI wired in on the Apps
// page. "Apps" is product-facing (only things you can click into); this is
// infrastructure-facing (every backend service and its live health), split
// into self-registered APIs vs. actively-probed infra (Postgres/MinIO/Redis).
export function ServicesPage() {
  const { registry, connected } = useServiceRegistry();
  const entries = Object.entries(registry).sort(([a], [b]) => a.localeCompare(b));
  const apiEntries = entries.filter(([, service]) => service.kind === "api");
  const infraEntries = entries.filter(([, service]) => service.kind === "infra");

  return (
    <div className="services-page">
      <Text variant="h4">Services</Text>
      {!connected ? (
        <Text variant="body2" color="#f5b342">
          Can't reach gatekeeper-api — check it (and its Redis) are running.
        </Text>
      ) : entries.length === 0 ? (
        <Text variant="body2" color="#9aa0a6">
          No services registered with gatekeeper-api yet.
        </Text>
      ) : (
        <>
          {apiEntries.length > 0 && (
            <section className="services-section">
              <Text variant="h6">APIs</Text>
              <div className="services-grid">
                {apiEntries.map(([name, service]) => (
                  <ServiceCard key={name} name={name} service={service} />
                ))}
              </div>
            </section>
          )}
          {infraEntries.length > 0 && (
            <section className="services-section">
              <Text variant="h6">Infrastructure</Text>
              <div className="services-grid">
                {infraEntries.map(([name, service]) => (
                  <ServiceCard key={name} name={name} service={service} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
