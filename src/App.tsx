import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { DashboardPage } from "./DashboardPage";
import { ServicesPage } from "./ServicesPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="services" element={<ServicesPage />} />
      </Route>
    </Routes>
  );
}
