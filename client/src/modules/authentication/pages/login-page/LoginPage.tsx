import { Fragment } from "react/jsx-runtime";
import { useLoginPageController } from "./login-page-controller";

export const LoginPage = () => {
  const {} = useLoginPageController();

  return (
    <Fragment>
      <h1>Login Page</h1>
    </Fragment>
  );
};
