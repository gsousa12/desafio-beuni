import "./App.css";
import { GlobalWrapper } from "./components/wrappers/global-wrapper/GlobalWrapper";
import { LoginPage } from "./features/auth/pages/LoginPage";

export const App = () => {
  const isAuthenticated = false;
  return (
    <GlobalWrapper>
      {/* Uncomment the following lines when the components are ready */}
      {isAuthenticated ? (
        <>
          {/* <Sidebar />
          <Header />
          <RoutesWrapper>
            <AppRoutes />
          </RoutesWrapper> */}
        </>
      ) : (
        <LoginPage />
      )}
    </GlobalWrapper>
  );
};
