import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const GATEKEEPER_URL = "http://localhost:8002";

export type ServiceStatus = "healthy" | "down";

export interface RegisteredService {
  base_url: string;
  registered_at: string;
  status: ServiceStatus;
}

type Registry = Record<string, RegisteredService>;

const ServiceRegistryContext = createContext<Registry>({});

// One EventSource connection to gatekeeper-api's registry stream, shared by
// every consumer via context — AppsPage (status chips) and App (the
// actual apiBaseUrl handed to a sub-app) both read from the same snapshot
// instead of each opening their own connection.
export function ServiceRegistryProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<Registry>({});

  useEffect(() => {
    // EventSource reconnects on its own after a drop — no manual retry
    // logic needed. While disconnected, the registry just stays at its
    // last-known snapshot (or empty, if gatekeeper-api was never reached),
    // which degrades every service to "Not registered" rather than crashing.
    const source = new EventSource(`${GATEKEEPER_URL}/services/stream`);
    source.onmessage = (event) => {
      const services = JSON.parse(event.data) as (RegisteredService & { name: string })[];
      const next: Registry = {};
      for (const service of services) {
        next[service.name] = { base_url: service.base_url, registered_at: service.registered_at, status: service.status };
      }
      setRegistry(next);
    };
    return () => source.close();
  }, []);

  return <ServiceRegistryContext.Provider value={registry}>{children}</ServiceRegistryContext.Provider>;
}

export function useServiceRegistry(): Registry {
  return useContext(ServiceRegistryContext);
}
