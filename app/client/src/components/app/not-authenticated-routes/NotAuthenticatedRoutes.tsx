import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../not-found-page/NotFoundPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

export const NotAuthenticatedRoutes = () => {
  return (
    <main className="flex flex-1 min-h-0 flex-col">
      <Routes>
        <Route path="*" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </main>
  );
};
