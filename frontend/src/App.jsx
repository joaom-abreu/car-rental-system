import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AutomobilesPage from "./pages/AutomobilesPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import ClientsPage from "./pages/ClientsPage";
import DesignSystemPage from "./pages/DesignSystemPage";
import LoginPage from "./pages/LoginPage";
import NewRequestPage from "./pages/NewRequestPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RequestDetailPage from "./pages/RequestDetailPage";
import RequestsPage from "./pages/RequestsPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignUpPage />} />
        <Route path="/design" element={<DesignSystemPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/pedidos" replace />} />
          <Route path="/pedidos" element={<RequestsPage />} />
          <Route path="/pedidos/:id" element={<RequestDetailPage />} />
          <Route path="/automoveis" element={<AutomobilesPage />} />
        </Route>
        <Route element={<ProtectedRoute clientOnly />}>
          <Route path="/pedidos/novo" element={<NewRequestPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
        <Route element={<ProtectedRoute agentOnly />}>
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/clientes/:id" element={<ClientDetailPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
