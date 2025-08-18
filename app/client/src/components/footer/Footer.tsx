export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100">
      <p>{`COPYRIGHT ${year} BeUni Tecnologia LTDA, Todos os direitos reservados`}</p>
    </footer>
  );
};
