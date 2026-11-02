import { useParams } from "react-router-dom";
import Alert from "../components/Alert/Alert";

function ClientDetailPage() {
  const { id } = useParams();
  return (
    <section>
      <h1>Cliente #{id}</h1>
      <Alert>Página em construção.</Alert>
    </section>
  );
}

export default ClientDetailPage;
