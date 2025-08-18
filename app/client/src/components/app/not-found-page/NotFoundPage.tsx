import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-orange-500 drop-shadow-lg">404</h1>
        <h2 className="mt-6 text-2xl font-bold text-gray-800">Página não encontrada</h2>
        <p className="mt-2 text-gray-600">
          O recurso que você está procurando não existe ou foi movido.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 rounded-2xl bg-orange-500 px-6 py-3 
          text-white font-semibold shadow-md transition duration-300
           hover:bg-orange-600 hover:shadow-lg focus:outline-none 
           focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 hover:cursor-pointer"
        >
          Voltar para Dashboard
        </button>
      </div>
    </div>
  );
};
