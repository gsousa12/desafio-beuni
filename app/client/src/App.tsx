import { Fragment } from "react/jsx-runtime";
import "./App.css";
import { GlobalWrapper } from "./components/wrappers/global-wrapper/GlobalWrapper";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RoutesWrapper } from "./components/wrappers/routes-wrapper/RoutesWrapper";
import { AuthenticatedRoutes } from "./components/app/authenticated-routes/AuthenticatedRoutes";
import { Header } from "./components/header/Header";
import { Footer } from "./components/footer/Footer";
import { NotAuthenticatedRoutes } from "./components/app/not-authenticated-routes/NotAuthenticatedRoutes";

export const App = () => {
  const isAuthenticated = false;
  return (
    <GlobalWrapper>
      {isAuthenticated ? (
        <Fragment>
          <Header />
          <RoutesWrapper>
            <AuthenticatedRoutes />
          </RoutesWrapper>
          <Footer />
        </Fragment>
      ) : (
        <NotAuthenticatedRoutes />
      )}
    </GlobalWrapper>
  );
};
