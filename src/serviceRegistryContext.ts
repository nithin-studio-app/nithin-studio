import { createContext, useContext } from "react";

export type ServiceStatus = "healthy" | "down";
export type ServiceKind = "api" | "infra";

export interface RegisteredService {
  /** Human-facing display name — separate from the registry key (the name
   * this service is looked up by, e.g. `registry["media-importer-api"]`),
   * which stays stable across a display-name rename so it doesn't leave
   * behind a stale duplicate entry. */
  title: string;
  base_url: string;
  registered_at: string;
  kind: ServiceKind;
  status: ServiceStatus;
}

export type Registry = Record<string, RegisteredService>;

export interface RegistryState {
  registry: Registry;
  /** False until the SSE stream has delivered at least one snapshot, and
   * flips back to false on any drop (e.g. gatekeeper-api itself down, or
   * reachable but unable to talk to Redis). Lets pages tell "gatekeeper-api
   * says nothing is registered" apart from "we can't currently ask
   * gatekeeper-api anything" — both otherwise look like an empty registry. */
  connected: boolean;
}

export const ServiceRegistryContext = createContext<RegistryState>({ registry: {}, connected: false });

export function useServiceRegistry(): RegistryState {
  return useContext(ServiceRegistryContext);
}
