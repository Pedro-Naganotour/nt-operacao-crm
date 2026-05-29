import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { ProtectedRoute } from "@/layouts/ProtectedRoute";
import { Dashboard } from "@/pages/Dashboard";
import { LoginPage } from "@/pages/LoginPage";
import { PassageirosPage } from "@/pages/PassageirosPage";
import { PassageiroPerfilPage } from "@/pages/PassageiroPerfilPage";
import { StubPage } from "@/components/stub-page";
import { KanbanPage } from "@/pages/KanbanPage";
import { VagasPage } from "@/pages/VagasPage";
import { EmpreiteirasPage } from "@/pages/EmpreiteirasPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="passageiros" element={<PassageirosPage />} />
        <Route path="passageiros/:id" element={<PassageiroPerfilPage />} />
        <Route path="kanban" element={<KanbanPage />} />
        <Route path="alertas" element={<StubPage title="Alertas" description="Alertas operacionais do CRM." />} />
        <Route path="kanban/comercial" element={<KanbanPage />} />
        <Route path="kanban/documentacao" element={<StubPage title="Kanban Documentação" description="Controle das etapas documentais." />} />
        <Route path="kanban/coe-visto" element={<StubPage title="Kanban COE / Visto" description="Acompanhamento de COE, visto e exigências." />} />
        <Route path="kanban/embarque" element={<StubPage title="Kanban Embarque" description="Reconsulta, passagens, contratos, exames e embarques." />} />
        <Route path="vagas" element={<VagasPage />} />
        <Route path="empreiteiras" element={<EmpreiteirasPage />} />
        <Route path="fabricas" element={<StubPage title="Fábricas" description="Cadastro de fábricas vinculadas às empreiteiras." />} />
        <Route path="despachantes" element={<StubPage title="Despachantes" description="Cadastro de despachantes e custos de visto." />} />
        <Route path="documentos" element={<StubPage title="Documentos" description="Controle de documentos, certidões, COE, visto e anexos." />} />
        <Route path="financeiro" element={<StubPage title="Financeiro" description="Custos, valores financiados, reembolsos e resultados." />} />
        <Route path="dividas" element={<StubPage title="Dívidas / Risco" description="Controle de risco financeiro, desistências e bloqueios." />} />
        <Route path="passagens" element={<StubPage title="Passagens" description="Reservas, autorizações e emissão de passagens aéreas." />} />
        <Route path="faturas" element={<StubPage title="Faturas" description="Faturas de financiamento, comissão e reembolso para empreiteiras." />} />
        <Route path="pos-venda" element={<StubPage title="Pós-venda" description="Check-ins de adaptação no Japão." />} />
        <Route path="equipe" element={<StubPage title="Equipe / Permissões" description="Usuários internos e perfis de acesso." />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
