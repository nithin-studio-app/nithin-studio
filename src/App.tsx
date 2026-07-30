import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProgressBar } from "@nithin-studio-app/ui-components";
import { Layout } from "./Layout";

const DashboardPage = lazy(() => import("./DashboardPage").then((m) => ({ default: m.DashboardPage })));
const ServicesPage = lazy(() => import("./ServicesPage").then((m) => ({ default: m.ServicesPage })));
const FilezillaPage = lazy(() => import("./FilezillaPage").then((m) => ({ default: m.FilezillaPage })));

function RouteFallback() {
  return (
    <div style={{ padding: "2rem" }}>
      <ProgressBar variant="indeterminate" aria-label="Loading page" />
    </div>
  );
}

export function App() {
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
        <Route
          path="services/filezilla"
          element={
            <Suspense fallback={<RouteFallback />}>
              <FilezillaPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
