import { Fragment } from "react/jsx-runtime";
import "./App.css";
import { GlobalWrapper } from "./components/wrappers/global-wrapper/GlobalWrapper";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RoutesWrapper } from "./components/wrappers/routes-wrapper/RoutesWrapper";
import { AppRoutes } from "./components/app/app-routes/AppRoutes";
import { Header } from "./components/header/Header";

export const App = () => {
  const isAuthenticated = true;
  return (
    <GlobalWrapper>
      {isAuthenticated ? (
        <Fragment>
          <Header />
          <RoutesWrapper>
            <AppRoutes />
          </RoutesWrapper>
        </Fragment>
      ) : (
        <LoginPage />
      )}
    </GlobalWrapper>
  );
};
