import { createContext, useContext } from "react";

export type ServiceStatus = "healthy" | "down";
export type ServiceKind = "api" | "infra";

export interface RegisteredService {
  base_url: string;
  registered_at: string;
  kind: ServiceKind;
  status: ServiceStatus;
}

export type Registry = Record<string, RegisteredService>;

export const ServiceRegistryContext = createContext<Registry>({});

export function useServiceRegistry(): Registry {
  return useContext(ServiceRegistryContext);
}
