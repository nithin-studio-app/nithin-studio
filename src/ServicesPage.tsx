import { Card, CardContent, CardHeader, Chip, Text } from "@nithin-studio-app/ui-components";
import { useServiceRegistry } from "./serviceRegistryContext";
import type { RegisteredService } from "./serviceRegistryContext";
import "./ServicesPage.css";

const STATUS_LABEL = { healthy: "Healthy", down: "Down" } as const;
const STATUS_COLOR = { healthy: "#64dd17", down: "#ff5252" } as const;

function ServiceCard({ name, service }: { name: string; service: RegisteredService }) {
  return (
    <Card key={name} variant="outlined">
      <CardHeader
        title={name}
        action={<Chip label={STATUS_LABEL[service.status]} color={STATUS_COLOR[service.status]} variant="outlined" />}
      />
      <CardContent>
        <Text variant="body2" color="#9aa0a6">
          {service.base_url}
        </Text>
      </CardContent>
    </Card>
  );
}

// Raw view of gatekeeper-api's registry — every backend process that has
// ever registered, regardless of whether it has a UI wired in on the Apps
// page. "Apps" is product-facing (only things you can click into); this is
// infrastructure-facing (every backend service and its live health), split
// into self-registered APIs vs. actively-probed infra (Postgres/MinIO/Redis).
export function ServicesPage() {
  const registry = useServiceRegistry();
  const entries = Object.entries(registry).sort(([a], [b]) => a.localeCompare(b));
  const apiEntries = entries.filter(([, service]) => service.kind === "api");
  const infraEntries = entries.filter(([, service]) => service.kind === "infra");

  return (
    <div className="services-page">
      <Text variant="h4">Services</Text>
      {entries.length === 0 ? (
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
