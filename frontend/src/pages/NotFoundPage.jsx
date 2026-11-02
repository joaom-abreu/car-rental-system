import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section>
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe.</p>
      <Link to="/">Voltar para o início</Link>
    </section>
  );
}

export default NotFoundPage;
