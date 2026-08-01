import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ProgressBar } from "@nithin-studio-app/ui-components";
import { Layout } from "./Layout";
import { ServiceRegistryProvider } from "./serviceRegistry";
import { useServiceRegistry } from "./serviceRegistryContext";

const DashboardPage = lazy(() => import("./DashboardPage").then((m) => ({ default: m.DashboardPage })));
const AppsPage = lazy(() => import("./AppsPage").then((m) => ({ default: m.AppsPage })));
const ServicesPage = lazy(() => import("./ServicesPage").then((m) => ({ default: m.ServicesPage })));
const FilezillaApp = lazy(() => import("@nithin-studio-app/filezilla").then((m) => ({ default: m.FilezillaApp })));

function RouteFallback() {
  return (
    <div style={{ padding: "2rem" }}>
      <ProgressBar variant="indeterminate" aria-label="Loading page" />
    </div>
  );
}

function FilezillaRoute() {
  const navigate = useNavigate();
  const { registry } = useServiceRegistry();
  // Undefined (rather than a stale/unreachable URL) when filezilla-api
  // isn't currently healthy — FileManager falls back to its own hardcoded
  // default in that case, same as before the registry existed.
  const apiBaseUrl = registry["filezilla-api"]?.status === "healthy" ? registry["filezilla-api"].base_url : undefined;

  return <FilezillaApp basePath="/apps/filezilla" onBack={() => navigate("/apps")} apiBaseUrl={apiBaseUrl} />;
}

export function App() {
  return (
    <ServiceRegistryProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<RouteFallback />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="apps"
            element={
              <Suspense fallback={<RouteFallback />}>
                <AppsPage />
              </Suspense>
            }
          />
          <Route
            path="services"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ServicesPage />
              </Suspense>
            }
          />
          {/* Only the mount point lives here — filezilla owns everything
              beneath it (its own sub-routes for folder/file deep-linking),
              so this never needs to change as that shape evolves. */}
          <Route
            path="apps/filezilla/*"
            element={
              <Suspense fallback={<RouteFallback />}>
                <FilezillaRoute />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </ServiceRegistryProvider>
  );
}
