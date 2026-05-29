import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

type ProcessoKanban = {
  id: string;
  pessoa_id: string;
  codigo_processo: string | null;
  status_atual: string | null;
  fase_atual: string | null;
  criado_em: string;
  pessoas: {
    id: string;
    nome_completo: string;
    telefone_whatsapp: string | null;
    cidade: string | null;
    estado: string | null;
    classificacao_risco: string | null;
  } | null;
};

const colunas = [
  "Lead novo",
  "Ficha enviada",
  "Ficha preenchida",
  "Perfil em análise",
  "Busca de vaga",
  "Entrevista",
  "Aguardando resultado",
  "Aprovado",
  "Documentação",
  "COE / Visto",
  "Embarque",
  "Pós-venda",
];

export function KanbanPage() {
  const [processos, setProcessos] = useState<ProcessoKanban[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarKanban() {
    setLoading(true);

    const { data, error } = await supabase
      .from("processos")
      .select(`
        id,
        pessoa_id,
        codigo_processo,
        status_atual,
        fase_atual,
        criado_em,
        pessoas (
          id,
          nome_completo,
          telefone_whatsapp,
          cidade,
          estado,
          classificacao_risco
        )
      `)
      .eq("ativo", true)
      .order("criado_em", { ascending: false });

    if (error) {
      console.error("Erro ao carregar kanban:", error);
      setProcessos([]);
    } else {
      setProcessos((data || []) as ProcessoKanban[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarKanban();
  }, []);

  async function moverProcesso(processo: ProcessoKanban, novoStatus: string) {
    const statusAnterior = processo.status_atual || "Lead novo";

    if (statusAnterior === novoStatus) return;

    const { error: updateError } = await supabase
      .from("processos")
      .update({
        status_atual: novoStatus,
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", processo.id);

    if (updateError) {
      alert("Erro ao mover processo.");
      console.error(updateError);
      return;
    }

    const { error: historicoError } = await supabase.from("historico").insert({
      pessoa_id: processo.pessoa_id,
      processo_id: processo.id,
      tipo_evento: "Mudança de status",
      descricao: `Processo movido de "${statusAnterior}" para "${novoStatus}".`,
      status_anterior: statusAnterior,
      status_novo: novoStatus,
    });

    if (historicoError) {
      console.error("Erro ao registrar histórico:", historicoError);
    }

    await carregarKanban();
  }

  const processosPorColuna = useMemo(() => {
    return colunas.reduce<Record<string, ProcessoKanban[]>>((acc, coluna) => {
      acc[coluna] = processos.filter(
        (processo) => (processo.status_atual || "Lead novo") === coluna
      );
      return acc;
    }, {});
  }, [processos]);

  if (loading) {
    return <div className="p-6">Carregando Kanban...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Kanban Comercial</h1>
        <p className="text-sm text-gray-500">
          Visualização e movimentação dos processos ativos.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {colunas.map((coluna) => (
          <div
            key={coluna}
            className="min-w-[290px] rounded-xl border bg-gray-50 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">{coluna}</h2>
              <span className="rounded-full bg-white px-2 py-1 text-xs text-gray-600">
                {processosPorColuna[coluna]?.length || 0}
              </span>
            </div>

            <div className="space-y-3">
              {(processosPorColuna[coluna] || []).length === 0 ? (
                <p className="text-sm text-gray-400">Nenhum processo</p>
              ) : (
                processosPorColuna[coluna].map((processo) => (
                  <div
                    key={processo.id}
                    className="rounded-lg border bg-white p-3 shadow-sm"
                  >
                    <Link
                      to={`/passageiros/${processo.pessoa_id}`}
                      className="block hover:underline"
                    >
                      <p className="font-medium">
                        {processo.pessoas?.nome_completo || "Pessoa sem nome"}
                      </p>
                    </Link>

                    <p className="mt-1 text-xs text-gray-500">
                      {processo.codigo_processo || "Sem código"}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      {processo.pessoas?.telefone_whatsapp || "Sem WhatsApp"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {processo.pessoas?.cidade || "-"} /{" "}
                      {processo.pessoas?.estado || "--"}
                    </p>

                    {processo.pessoas?.classificacao_risco &&
                      processo.pessoas.classificacao_risco !== "Sem risco" && (
                        <div className="mt-2 rounded bg-red-100 px-2 py-1 text-xs text-red-700">
                          Risco: {processo.pessoas.classificacao_risco}
                        </div>
                      )}

                    <div className="mt-3">
                      <label className="mb-1 block text-xs text-gray-500">
                        Mover para:
                      </label>
                      <select
                        value={processo.status_atual || "Lead novo"}
                        onChange={(e) => moverProcesso(processo, e.target.value)}
                        className="w-full rounded-md border px-2 py-1 text-sm"
                      >
                        {colunas.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
