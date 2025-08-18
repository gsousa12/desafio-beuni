import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../not-found-page/NotFoundPage";
import { ProtectedRoute } from "../app-protected-route/ProtectedRoute";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

export const AppRoutes = () => {
  return (
    <main className="flex flex-1 flex-col">
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </main>
  );
};
