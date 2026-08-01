import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { RegisteredService, Registry } from "./serviceRegistryContext";
import { ServiceRegistryContext } from "./serviceRegistryContext";

const GATEKEEPER_URL = "http://localhost:8000";

// One EventSource connection to gatekeeper-api's registry stream, shared by
// every consumer via context — AppsPage (status chips) and App (the
// actual apiBaseUrl handed to a sub-app) both read from the same snapshot
// instead of each opening their own connection.
export function ServiceRegistryProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<Registry>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // EventSource reconnects on its own after a drop — no manual retry
    // logic needed. `connected` tracks whether we currently have a live
    // stream; pages use it to distinguish "genuinely nothing registered"
    // from "can't reach gatekeeper-api right now" (e.g. its Redis is down),
    // which otherwise both present as an empty registry.
    const source = new EventSource(`${GATEKEEPER_URL}/services/stream`);
    source.onmessage = (event) => {
      const services = JSON.parse(event.data) as (RegisteredService & { name: string })[];
      const next: Registry = {};
      for (const service of services) {
        next[service.name] = {
          base_url: service.base_url,
          registered_at: service.registered_at,
          kind: service.kind,
          status: service.status,
        };
      }
      setRegistry(next);
      setConnected(true);
    };
    source.onerror = () => setConnected(false);
    return () => source.close();
  }, []);

  return (
    <ServiceRegistryContext.Provider value={{ registry, connected }}>{children}</ServiceRegistryContext.Provider>
  );
}
