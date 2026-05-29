import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

type Processo = {
  id: string;
  pessoa_id: string;
  codigo_processo: string | null;
  ano_processo: number | null;
  status_atual: string | null;
  fase_atual: string | null;
  resultado_final: string | null;
  data_inicio: string | null;
  data_encerramento: string | null;
  motivo_encerramento: string | null;
  ativo: boolean | null;
  observacoes: string | null;
  pessoas: {
    id: string;
    nome_completo: string;
    telefone_whatsapp: string | null;
    email: string | null;
    cidade: string | null;
    estado: string | null;
    classificacao_risco: string | null;
  } | null;
};

type Historico = {
  id: string;
  tipo_evento: string;
  descricao: string;
  status_anterior: string | null;
  status_novo: string | null;
  criado_em: string;
};
type Vaga = {
  id: string;
  titulo_vaga: string;
  cidade: string | null;
  provincia: string | null;
  status_vaga: string | null;
  empreiteira_id: string | null;
  empreiteiras: {
    nome: string;
    } | null;
  } 
type ApresentacaoVaga = {
  id: string;
  vaga_id: string | null;
  empreiteira_id: string | null;
  data_apresentacao: string | null;
  status: string | null;
  resultado_final: string | null;
  observacoes: string | null;
  vagas: {
    titulo_vaga: string;
    cidade: string | null;
    provincia: string | null;
  } | null;
  empreiteiras: {
    nome: string;
  } | null;
};
type Entrevista = {
  id: string;
  apresentacao_id: string | null;
  data_entrevista: string | null;
  formato: string | null;
  forma_entrevista: string | null;
  link_ou_local: string | null;
  status_entrevista: string | null;
  resultado: string | null;
  observacoes: string | null;
};

const abas = [
  "Resumo",
  "Vagas e Entrevistas",
  "Documentação",
  "Embarque",
  "Financeiro",
  "Histórico",
];

export function ProcessoPerfilPage() {
  const { id } = useParams();
  const [abaAtiva, setAbaAtiva] = useState("Resumo");
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [vagas, setVagas] = useState<Vaga[]>([]);
const [apresentacoes, setApresentacoes] = useState<ApresentacaoVaga[]>([]);
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProcesso() {
      const { data: vagasData } = await supabase
  .from("vagas")
  .select(`
    id,
    titulo_vaga,
    cidade,
    provincia,
    status_vaga,
    empreiteira_id,
    empreiteiras (
      nome
    )
  `)
  .in("status_vaga", ["Aberta", "Em seleção", "Urgente"])
  .order("criado_em", { ascending: false });

const { data: apresentacoesData } = await supabase
  .from("apresentacoes_vaga")
  .select(`
    *,
    vagas (
      titulo_vaga,
      cidade,
      provincia
    ),
    empreiteiras (
      nome
    )
  `)
  .eq("processo_id", id)
  .order("criado_em", { ascending: false });

setVagas((vagasData || []) as Vaga[]);
      const { data: entrevistasData } = await supabase
  .from("entrevistas")
  .select("*")
  .eq("processo_id", id)
  .order("data_entrevista", { ascending: true });

setEntrevistas((entrevistasData || []) as Entrevista[]);
setApresentacoes((apresentacoesData || []) as ApresentacaoVaga[]);
      if (!id) return;

      setLoading(true);

      const { data: processoData, error: processoError } = await supabase
        .from("processos")
        .select(`
          *,
          pessoas (
            id,
            nome_completo,
            telefone_whatsapp,
            email,
            cidade,
            estado,
            classificacao_risco
          )
        `)
        .eq("id", id)
        .single();

      if (processoError) {
        console.error("Erro ao carregar processo:", processoError);
        setProcesso(null);
        setLoading(false);
        return;
      }

      const { data: historicoData } = await supabase
        .from("historico")
        .select("*")
        .eq("processo_id", id)
        .order("criado_em", { ascending: false });

      setProcesso(processoData as Processo);
      setHistorico((historicoData || []) as Historico[]);
      setLoading(false);
    }

    carregarProcesso();
  }, [id]);

  if (loading) return <div className="p-6">Carregando processo...</div>;

  if (!processo) return <div className="p-6">Processo não encontrado.</div>;
async function criarApresentacao(vaga: Vaga) {
  if (!processo) return;

  const { error } = await supabase.from("apresentacoes_vaga").insert({
    processo_id: processo.id,
    vaga_id: vaga.id,
    empreiteira_id: vaga.empreiteira_id,
    status: "Apresentação enviada",
    data_apresentacao: new Date().toISOString().slice(0, 10),
    observacoes: null,
  });

  if (error) {
    alert("Erro ao criar apresentação.");
    console.error(error);
    return;
  }

  await supabase.from("historico").insert({
    pessoa_id: processo.pessoa_id,
    processo_id: processo.id,
    tipo_evento: "Apresentação de vaga",
    descricao: `Apresentação criada para a vaga ${vaga.titulo_vaga}.`,
    status_novo: "Apresentação enviada",
  });

  window.location.reload();
}
 async function criarEntrevista(apresentacaoId: string) {
  const data = prompt("Data da entrevista no formato AAAA-MM-DD. Ex: 2026-01-15");
  if (!data) return;

  const hora = prompt("Horário da entrevista. Ex: 09:00");
  if (!hora) return;

  const dataHora = `${data}T${hora}:00`;

  const { error } = await supabase.from("entrevistas").insert({
    processo_id: id,
    apresentacao_id: apresentacaoId,
    data_entrevista: dataHora,
    formato: "Online",
    status_entrevista: "Agendada",
    resultado: "Aguardando",
  });

  if (error) {
    alert("Erro ao criar entrevista.");
    console.error(error);
    return;
  }

  window.location.reload();
 }
  return (
    <div className="space-y-6 p-6">
      <Link to="/passageiros" className="text-sm text-blue-600 hover:underline">
        ← Voltar para passageiros
      </Link>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {processo.codigo_processo || "Processo sem código"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Pessoa:{" "}
              <Link
                to={`/passageiros/${processo.pessoa_id}`}
                className="text-blue-600 hover:underline"
              >
                {processo.pessoas?.nome_completo || "Pessoa sem nome"}
              </Link>
            </p>

            <p className="text-sm text-gray-500">
              WhatsApp: {processo.pessoas?.telefone_whatsapp || "-"} ·{" "}
              {processo.pessoas?.cidade || "Cidade não informada"} /{" "}
              {processo.pessoas?.estado || "--"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {processo.status_atual || "Sem status"}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              {processo.fase_atual || "Sem fase"}
            </span>

            {processo.pessoas?.classificacao_risco &&
              processo.pessoas.classificacao_risco !== "Sem risco" && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                  Risco: {processo.pessoas.classificacao_risco}
                </span>
              )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b">
        {abas.map((aba) => (
          <button
            key={aba}
            onClick={() => setAbaAtiva(aba)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
              abaAtiva === aba
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {aba}
          </button>
        ))}
      </div>

      {abaAtiva === "Resumo" && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card titulo="Status do processo">
            <Info label="Status atual" value={processo.status_atual} />
            <Info label="Fase atual" value={processo.fase_atual} />
            <Info label="Resultado final" value={processo.resultado_final} />
          </Card>

          <Card titulo="Datas">
            <Info label="Início" value={processo.data_inicio} />
            <Info label="Encerramento" value={processo.data_encerramento} />
            <Info label="Ano" value={processo.ano_processo?.toString()} />
          </Card>

          <Card titulo="Observações">
            <Info label="Observações" value={processo.observacoes} />
            <Info label="Motivo encerramento" value={processo.motivo_encerramento} />
          </Card>
        </div>
      )}

 {abaAtiva === "Vagas e Entrevistas" && (
  <div className="space-y-6">
    <Card titulo="Apresentações deste processo">
      {apresentacoes.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nenhuma apresentação criada ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {apresentacoes.map((apresentacao) => (
            <div key={apresentacao.id} className="rounded-lg border p-4">
              <p className="font-medium">
                {apresentacao.empreiteiras?.nome || "Empreiteira não informada"}
              </p>

              <p className="text-sm text-gray-600">
                {apresentacao.vagas?.titulo_vaga || "Vaga não informada"}
              </p>

              <p className="text-sm text-gray-500">
                {apresentacao.vagas?.cidade || "-"} /{" "}
                {apresentacao.vagas?.provincia || "--"}
              </p>

              <p className="mt-2 text-sm">
                <strong>Status:</strong> {apresentacao.status || "-"}
              </p>

              <p className="text-sm">
                <strong>Resultado:</strong> {apresentacao.resultado_final || "-"}
              </p>

              <div className="mt-4 border-t pt-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Entrevistas</p>

                  <button
                    onClick={() => criarEntrevista(apresentacao.id)}
                    className="rounded bg-green-600 px-2 py-1 text-xs text-white"
                  >
                    Nova entrevista
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  {entrevistas
                    .filter((entrevista) => entrevista.apresentacao_id === apresentacao.id)
                    .map((entrevista) => (
                      <div
                        key={entrevista.id}
                        className="rounded border bg-gray-50 p-2 text-xs"
                      >
                        <p>
                          <strong>Data:</strong> {entrevista.data_entrevista || "-"}
                        </p>
                        <p>
                          <strong>Status:</strong> {entrevista.status_entrevista || "-"}
                        </p>
                        <p>
                          <strong>Resultado:</strong> {entrevista.resultado || "-"}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>

    <Card titulo="Vagas disponíveis para apresentação">
      {vagas.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nenhuma vaga aberta encontrada.
        </p>
      ) : (
        <div className="space-y-3">
          {vagas.map((vaga) => {
            const apresentacoesDaVaga = apresentacoes.filter(
              (apresentacao) => apresentacao.vaga_id === vaga.id
            );

            const ultimaApresentacao = apresentacoesDaVaga[0];

            return (
              <div
                key={vaga.id}
                className="rounded-lg border p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{vaga.titulo_vaga}</p>

                  <p className="text-sm text-gray-600">
                    {vaga.empreiteiras?.nome || "Sem empreiteira"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {vaga.cidade || "-"} / {vaga.provincia || "--"} ·{" "}
                    {vaga.status_vaga || "-"}
                  </p>

                  {apresentacoesDaVaga.length > 0 && (
                    <div className="mt-2 rounded bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
                      <p>
                        Já apresentada: {apresentacoesDaVaga.length}{" "}
                        {apresentacoesDaVaga.length === 1 ? "vez" : "vezes"}
                      </p>
                      <p>
                        Última apresentação:{" "}
                        {ultimaApresentacao?.data_apresentacao || "-"}
                      </p>
                      <p>
                        Último resultado:{" "}
                        {ultimaApresentacao?.resultado_final || "-"}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => criarApresentacao(vaga)}
                  className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
                >
                  {apresentacoesDaVaga.length > 0
                    ? "Apresentar novamente"
                    : "Apresentar"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  </div>
)}
      {abaAtiva === "Documentação" && (
        <Card titulo="Documentação">
          <p className="text-sm text-gray-500">
            Próxima etapa: checklist documental, documentos recebidos, pendências, COE e visto.
          </p>
        </Card>
      )}

      {abaAtiva === "Embarque" && (
        <Card titulo="Embarque">
          <p className="text-sm text-gray-500">
            Próxima etapa: reconsulta, passagem, autorização, seguro, exames e contratos.
          </p>
        </Card>
      )}

      {abaAtiva === "Financeiro" && (
        <Card titulo="Financeiro">
          <p className="text-sm text-gray-500">
            Próxima etapa: custos, faturas, recebimentos e pendências financeiras.
          </p>
        </Card>
      )}

      {abaAtiva === "Histórico" && (
        <Card titulo="Histórico do processo">
          {historico.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum histórico encontrado.</p>
          ) : (
            <div className="space-y-3">
              {historico.map((item) => (
                <div key={item.id} className="rounded-lg border p-3">
                  <p className="font-medium">{item.tipo_evento}</p>
                  <p className="text-sm text-gray-600">{item.descricao}</p>
                  {(item.status_anterior || item.status_novo) && (
                    <p className="mt-1 text-xs text-gray-500">
                      {item.status_anterior || "-"} → {item.status_novo || "-"}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(item.criado_em).toLocaleString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function Card({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">{titulo}</h2>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <p>
      <strong>{label}:</strong> {value || "-"}
    </p>
  );
}
