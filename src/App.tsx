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
const ImageImporter = lazy(() =>
  import("@nithin-studio-app/image-importer").then((m) => ({ default: m.ImageImporter })),
);
const FrameExtractor = lazy(() =>
  import("@nithin-studio-app/frame-extractor").then((m) => ({ default: m.FrameExtractor })),
);

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

function ImageImporterRoute() {
  const navigate = useNavigate();
  const { registry } = useServiceRegistry();
  // Undefined (rather than a stale/unreachable URL) when a service isn't
  // currently healthy — ImageImporter falls back to its own hardcoded
  // defaults in that case, same pattern FilezillaRoute uses above.
  const apiBaseUrl =
    registry["image-importer-api"]?.status === "healthy" ? registry["image-importer-api"].base_url : undefined;
  const filezillaApiBaseUrl =
    registry["filezilla-api"]?.status === "healthy" ? registry["filezilla-api"].base_url : undefined;

  return (
    <ImageImporter
      onBack={() => navigate("/apps")}
      apiBaseUrl={apiBaseUrl}
      filezillaApiBaseUrl={filezillaApiBaseUrl}
    />
  );
}

function FrameExtractorRoute() {
  const navigate = useNavigate();
  const { registry } = useServiceRegistry();
  const filezillaApiBaseUrl =
    registry["filezilla-api"]?.status === "healthy" ? registry["filezilla-api"].base_url : undefined;

  return <FrameExtractor onBack={() => navigate("/apps")} filezillaApiBaseUrl={filezillaApiBaseUrl} />;
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
          {/* No sub-routes (yet) — image-importer has no internal
              deep-linking, so this is a plain leaf route rather than a
              wildcard mount like filezilla's. */}
          <Route
            path="apps/image-importer"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ImageImporterRoute />
              </Suspense>
            }
          />
          {/* No sub-routes (yet), same reasoning as image-importer's route
              above. */}
          <Route
            path="apps/frame-extractor"
            element={
              <Suspense fallback={<RouteFallback />}>
                <FrameExtractorRoute />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </ServiceRegistryProvider>
  );
}
