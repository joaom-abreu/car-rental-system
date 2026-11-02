import { useParams } from "react-router-dom";
import Alert from "../components/Alert/Alert";

function RequestDetailPage() {
  const { id } = useParams();
  return (
    <section>
      <h1>Pedido #{id}</h1>
      <Alert>Página em construção.</Alert>
    </section>
  );
}

export default RequestDetailPage;
