import logo from "../../../../assets/logo.svg";
import bgImage from "../../../../assets/login-page-bg-img.png";

export const LoginPageLeftSide = () => {
  return (
    <div className="relative h-full w-full">
      {/* Logo no canto superior esquerdo */}
      <img src={logo} alt="Logo" className="absolute top-0 left-0 w-24 h-auto md:w-32 m-4" />

      {/* Imagem de fundo centralizada */}
      <div className="h-full flex items-center justify-center">
        <img
          src={bgImage}
          alt="Background"
          className="img-fluid mt-4 lg:tw-max-w-2xl"
          style={{ width: "588px", height: "588px" }}
        />
      </div>
    </div>
  );
};
