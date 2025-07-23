import { GlobalWrapper } from "./common/wrappers/global-wrapper/GlobalWrapper";
import { Fragment } from "react/jsx-runtime";
import { LoginPage } from "./modules/authentication/pages/login-page/LoginPage";

export const App = () => {
  const isAuthenticated = false;
  return (
    <GlobalWrapper>
      {isAuthenticated ? <Fragment></Fragment> : <LoginPage />}
    </GlobalWrapper>
  );
};
