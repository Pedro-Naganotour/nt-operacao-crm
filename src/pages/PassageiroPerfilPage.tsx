import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

type Pessoa = {
  id: string;
  nome_completo: string;
  cpf: string | null;
  rg: string | null;
  data_nascimento: string | null;
  telefone_whatsapp: string | null;
  email: string | null;
  cidade: string | null;
  estado: string | null;
  status_geral: string | null;
  classificacao_risco: string | null;
  origem_lead: string | null;
  observacoes_gerais: string | null;
  bloqueado_novo_processo: boolean | null;
  motivo_bloqueio: string | null;
};

type Processo = {
  id: string;
  codigo_processo: string | null;
  status_atual: string | null;
  fase_atual: string | null;
  resultado_final: string | null;
  data_inicio: string | null;
  data_encerramento: string | null;
  motivo_encerramento: string | null;
  ativo: boolean | null;
  observacoes: string | null;
};

type Historico = {
  id: string;
  tipo_evento: string;
  descricao: string;
  status_anterior: string | null;
  status_novo: string | null;
  criado_em: string;
};

type GrupoFamiliar = {
  id: string;
  nome_grupo: string;
  status_grupo: string | null;
  observacoes: string | null;
};

type MembroGrupo = {
  id: string;
  papel_no_grupo: string | null;
  parentesco: string | null;
  responsavel_principal: boolean | null;
  pessoas: {
    id: string;
    nome_completo: string;
    telefone_whatsapp: string | null;
    status_geral: string | null;
  } | null;
};

const abas = [
  "Resumo",
  "Dados pessoais",
  "Processos",
  "Grupo familiar",
  "Histórico",
  "Documentos",
  "Financeiro",
  "Riscos",
  "Passagem",
  "Pós-venda",
];

export function PassageiroPerfilPage() {
  const { id } = useParams();
  const [abaAtiva, setAbaAtiva] = useState("Resumo");
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [grupoFamiliar, setGrupoFamiliar] = useState<GrupoFamiliar | null>(null);
  const [membrosGrupo, setMembrosGrupo] = useState<MembroGrupo[]>([]);
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

      const { data: vinculoGrupo } = await supabase
        .from("grupo_familiar_membros")
        .select("grupo_id")
        .eq("pessoa_id", id)
        .maybeSingle();

      if (vinculoGrupo?.grupo_id) {
        const { data: grupoData } = await supabase
          .from("grupos_familiares")
          .select("*")
          .eq("id", vinculoGrupo.grupo_id)
          .single();

        const { data: membrosData } = await supabase
          .from("grupo_familiar_membros")
          .select(`
            id,
            papel_no_grupo,
            parentesco,
            responsavel_principal,
            pessoas (
              id,
              nome_completo,
              telefone_whatsapp,
              status_geral
            )
          `)
          .eq("grupo_id", vinculoGrupo.grupo_id)
          .order("responsavel_principal", { ascending: false });

        setGrupoFamiliar(grupoData as GrupoFamiliar);
        setMembrosGrupo((membrosData || []) as MembroGrupo[]);
      } else {
        setGrupoFamiliar(null);
        setMembrosGrupo([]);
      }

      setPessoa(pessoaData as Pessoa);
      setProcessos((processosData || []) as Processo[]);
      setHistorico((historicoData || []) as Historico[]);
      setLoading(false);
    }

    carregarPerfil();
  }, [id]);

  if (loading) return <div className="p-6">Carregando perfil...</div>;

  if (!pessoa) return <div className="p-6">Passageiro não encontrado.</div>;

  const processoAtual = processos[0];

  return (
    <div className="space-y-6 p-6">
      <a href="/passageiros" className="text-sm text-blue-600 hover:underline">
        ← Voltar para passageiros
      </a>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{pessoa.nome_completo}</h1>
        <p className="text-sm text-gray-500">
          {pessoa.telefone_whatsapp || "Sem WhatsApp"} · {pessoa.cidade || "Cidade não informada"} / {pessoa.estado || "--"}
        </p>
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
          <Card titulo="Status atual">
            <Info label="Status" value={pessoa.status_geral} />
            <Info label="Fase" value={processoAtual?.fase_atual} />
          </Card>

          <Card titulo="Processo atual">
            <Info label="Status" value={processoAtual?.status_atual} />
            <Info label="Início" value={processoAtual?.data_inicio} />
          </Card>

          <Card titulo="Risco">
            <Info label="Classificação" value={pessoa.classificacao_risco} />
            <Info label="Bloqueio" value={pessoa.motivo_bloqueio} />
          </Card>
        </div>
      )}

      {abaAtiva === "Dados pessoais" && (
        <Card titulo="Dados pessoais">
          <Info label="Nome" value={pessoa.nome_completo} />
          <Info label="CPF" value={pessoa.cpf} />
          <Info label="RG" value={pessoa.rg} />
          <Info label="Nascimento" value={pessoa.data_nascimento} />
          <Info label="WhatsApp" value={pessoa.telefone_whatsapp} />
          <Info label="E-mail" value={pessoa.email} />
          <Info label="Cidade" value={pessoa.cidade} />
          <Info label="Estado" value={pessoa.estado} />
          <Info label="Origem" value={pessoa.origem_lead} />
          <Info label="Observações" value={pessoa.observacoes_gerais} />
        </Card>
      )}

      {abaAtiva === "Processos" && (
        <Card titulo="Processos desta pessoa">
  {processos.length === 0 ? (
    <p className="text-sm text-gray-500">
      Nenhum processo encontrado.
    </p>
  ) : (
    <div className="space-y-3">
      {processos.map((processo) => (
        <div
          key={processo.id}
          className="rounded-lg border p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-medium">
              {processo.codigo_processo || "Sem código"}
            </p>

            <p className="text-sm text-gray-500">
              Status: {processo.status_atual || "-"}
            </p>

            <p className="text-sm text-gray-500">
              Fase: {processo.fase_atual || "-"}
            </p>
          </div>

          <a
            href={`/processos/${processo.id}`}
            className="rounded bg-blue-600 px-3 py-2 text-white text-sm"
          >
            Abrir Processo
          </a>
        </div>
      ))}
    </div>
  )}
</Card>

      {abaAtiva === "Grupo familiar" && (
        <Card titulo="Grupo familiar">
          {grupoFamiliar ? (
            <div className="space-y-4">
              <Info label="Grupo" value={grupoFamiliar.nome_grupo} />
              <Info label="Status" value={grupoFamiliar.status_grupo} />
              <Info label="Observações" value={grupoFamiliar.observacoes} />

              <div className="space-y-2">
                <h3 className="font-semibold">Membros</h3>

                {membrosGrupo.map((membro) => (
                  <div key={membro.id} className="rounded-lg border p-3">
                    <p className="font-medium">
                      {membro.pessoas?.nome_completo || "Pessoa sem nome"}
                      {membro.responsavel_principal ? " · Responsável" : ""}
                    </p>
                    <p className="text-sm text-gray-600">Parentesco: {membro.parentesco || "-"}</p>
                    <p className="text-sm text-gray-600">Papel: {membro.papel_no_grupo || "-"}</p>
                    <p className="text-sm text-gray-600">WhatsApp: {membro.pessoas?.telefone_whatsapp || "-"}</p>
                    <p className="text-sm text-gray-600">Status: {membro.pessoas?.status_geral || "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Esta pessoa ainda não está vinculada a nenhum grupo familiar.
            </p>
          )}
        </Card>
      )}

      {abaAtiva === "Histórico" && (
        <Card titulo="Histórico">
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
        </Card>
      )}

      {abaAtiva === "Documentos" && <Card titulo="Documentos"><p>Módulo preparado.</p></Card>}
      {abaAtiva === "Financeiro" && <Card titulo="Financeiro"><p>Módulo preparado.</p></Card>}
      {abaAtiva === "Riscos" && (
        <Card titulo="Riscos">
          <Info label="Classificação" value={pessoa.classificacao_risco} />
          <Info label="Bloqueado" value={pessoa.bloqueado_novo_processo ? "Sim" : "Não"} />
          <Info label="Motivo" value={pessoa.motivo_bloqueio} />
        </Card>
      )}
      {abaAtiva === "Passagem" && <Card titulo="Passagem aérea"><p>Módulo preparado.</p></Card>}
      {abaAtiva === "Pós-venda" && <Card titulo="Pós-venda"><p>Módulo preparado.</p></Card>}
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
