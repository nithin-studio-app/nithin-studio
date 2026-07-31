import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ProgressBar } from "@nithin-studio-app/ui-components";
import { Layout } from "./Layout";

const DashboardPage = lazy(() => import("./DashboardPage").then((m) => ({ default: m.DashboardPage })));
const ServicesPage = lazy(() => import("./ServicesPage").then((m) => ({ default: m.ServicesPage })));
const FilezillaApp = lazy(() => import("@nithin-studio-app/filezilla").then((m) => ({ default: m.FilezillaApp })));

function RouteFallback() {
  return (
    <div style={{ padding: "2rem" }}>
      <ProgressBar variant="indeterminate" aria-label="Loading page" />
    </div>
  );
}

export function App() {
  const navigate = useNavigate();

  return (
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
          path="services/filezilla/*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <FilezillaApp basePath="/services/filezilla" onBack={() => navigate("/services")} />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
