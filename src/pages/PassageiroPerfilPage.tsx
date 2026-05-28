import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Pessoa = {
  id: string;
  nome_completo: string;
  telefone_whatsapp: string | null;
  email: string | null;
  cidade: string | null;
  estado: string | null;
  status_geral: string | null;
  classificacao_risco: string | null;
  origem_lead: string | null;
  observacoes_gerais: string | null;
};

type Processo = {
  id: string;
  status_atual: string | null;
  fase_atual: string | null;
  codigo_processo: string | null;
  data_inicio: string | null;
  ativo: boolean | null;
};

type Historico = {
  id: string;
  tipo_evento: string;
  descricao: string;
  criado_em: string;
};

export function PassageiroPerfilPage() {
  const { id } = useParams();
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      if (!id) return;

      setLoading(true);

      const { data: pessoaData } = await supabase
        .from("pessoas")
        .select("*")
        .eq("id", id)
        .single();

      const { data: processosData } = await supabase
        .from("processos")
        .select("*")
        .eq("pessoa_id", id)
        .order("criado_em", { ascending: false });

      const { data: historicoData } = await supabase
        .from("historico")
        .select("*")
        .eq("pessoa_id", id)
        .order("criado_em", { ascending: false });

      setPessoa(pessoaData);
      setProcessos(processosData || []);
      setHistorico(historicoData || []);
      setLoading(false);
    }

    carregarPerfil();
  }, [id]);

  if (loading) {
    return <div className="p-6">Carregando perfil...</div>;
  }

  if (!pessoa) {
    return <div className="p-6">Passageiro não encontrado.</div>;
  }

  const processoAtual = processos[0];

  return (
    <div className="space-y-6 p-6">
      <div>
        <a href="/passageiros" className="text-sm text-blue-600 hover:underline">
          ← Voltar para passageiros
        </a>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{pessoa.nome_completo}</h1>
          <p className="text-sm text-gray-500">
            Status: {pessoa.status_geral || "Lead novo"} · Risco:{" "}
            {pessoa.classificacao_risco || "Sem risco"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">Dados pessoais</h2>
          <div className="space-y-2 text-sm">
            <p><strong>WhatsApp:</strong> {pessoa.telefone_whatsapp || "-"}</p>
            <p><strong>E-mail:</strong> {pessoa.email || "-"}</p>
            <p><strong>Cidade:</strong> {pessoa.cidade || "-"}</p>
            <p><strong>Estado:</strong> {pessoa.estado || "-"}</p>
            <p><strong>Origem:</strong> {pessoa.origem_lead || "-"}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">Processo atual</h2>
          {processoAtual ? (
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {processoAtual.status_atual || "-"}</p>
              <p><strong>Fase:</strong> {processoAtual.fase_atual || "-"}</p>
              <p><strong>Código:</strong> {processoAtual.codigo_processo || "-"}</p>
              <p><strong>Início:</strong> {processoAtual.data_inicio || "-"}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhum processo encontrado.</p>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">Observações</h2>
          <p className="text-sm text-gray-600">
            {pessoa.observacoes_gerais || "Nenhuma observação registrada."}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">Histórico</h2>

        {historico.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum histórico encontrado.</p>
        ) : (
          <div className="space-y-3">
            {historico.map((item) => (
              <div key={item.id} className="rounded-lg border p-3">
                <p className="font-medium">{item.tipo_evento}</p>
                <p className="text-sm text-gray-600">{item.descricao}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(item.criado_em).toLocaleString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
