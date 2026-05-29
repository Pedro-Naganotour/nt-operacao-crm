import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";

type Vaga = {
  id: string;
  titulo_vaga: string;
  cidade: string | null;
  provincia: string | null;
  tipo_servico: string | null;
  salario_hora_jpy: number | null;
  turno: string | null;
  escala: string | null;
  quantidade_vagas: number | null;
  status_vaga: string | null;
  urgente: boolean | null;
  observacoes: string | null;
empreiteira_id: string | null;
empreiteiras: {
  nome: string;
} | null;
};
type Empreiteira = {
  id: string;
  nome: string;
};

const formInicial = {
  titulo_vaga: "",
  cidade: "",
  provincia: "",
  tipo_servico: "",
  salario_hora_jpy: "",
  turno: "",
  escala: "",
  quantidade_vagas: "",
  status_vaga: "Aberta",
  urgente: false,
  observacoes: "",
  empreiteira_id: "",
};

export function VagasPage() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [empreiteiras, setEmpreiteiras] = useState<Empreiteira[]>([]);
  const [form, setForm] = useState(formInicial);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  

  async function carregarVagas() {
    setLoading(true);

    const { data, error } = await supabase
      .from("vagas")
      .select(`
  *,
  empreiteiras (
    nome
  )
`)
      .order("criado_em", { ascending: false });

    if (error) {
      console.error("Erro ao carregar vagas:", error);
      setVagas([]);
    } else {
      setVagas((data || []) as Vaga[]);
    }

    setLoading(false);
  }

 useEffect(() => {
  carregarVagas();
  carregarEmpreiteiras();
}, []);
  async function carregarEmpreiteiras() {
  const { data, error } = await supabase
    .from("empreiteiras")
    .select("id, nome")
    .eq("status", "Ativa")
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao carregar empreiteiras:", error);
    setEmpreiteiras([]);
  } else {
    setEmpreiteiras((data || []) as Empreiteira[]);
  }
}

  async function salvarVaga(event: React.FormEvent) {
    event.preventDefault();
    setSalvando(true);

    const { error } = await supabase.from("vagas").insert({
      empreiteira_id: form.empreiteira_id || null,
      <div className="space-y-1">
  <label className="text-sm font-medium">Empreiteira</label>
  <select
    value={form.empreiteira_id}
    onChange={(e) =>
      setForm({ ...form, empreiteira_id: e.target.value })
    }
    className="w-full rounded-md border px-3 py-2 text-sm"
  >
    <option value="">Selecione uma empreiteira</option>
    {empreiteiras.map((empreiteira) => (
      <option key={empreiteira.id} value={empreiteira.id}>
        {empreiteira.nome}
      </option>
    ))}
  </select>
</div>
      titulo_vaga: form.titulo_vaga,
      cidade: form.cidade || null,
      provincia: form.provincia || null,
      tipo_servico: form.tipo_servico || null,
      salario_hora_jpy: form.salario_hora_jpy
        ? Number(form.salario_hora_jpy)
        : null,
      turno: form.turno || null,
      escala: form.escala || null,
      quantidade_vagas: form.quantidade_vagas
        ? Number(form.quantidade_vagas)
        : null,
      status_vaga: form.status_vaga,
      urgente: form.urgente,
      observacoes: form.observacoes || null,
    });

    if (error) {
      alert("Erro ao salvar vaga.");
      console.error(error);
    } else {
      setForm(formInicial);
      await carregarVagas();
    }

    setSalvando(false);
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Vagas</h1>
        <p className="text-sm text-gray-500">
          Cadastro e controle das vagas disponíveis no Japão.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Cadastrar nova vaga</h2>

        <form onSubmit={salvarVaga} className="grid gap-4 md:grid-cols-3">
          <Campo
            label="Título da vaga"
            value={form.titulo_vaga}
            onChange={(v) => setForm({ ...form, titulo_vaga: v })}
            required
          />

          <Campo
            label="Cidade"
            value={form.cidade}
            onChange={(v) => setForm({ ...form, cidade: v })}
          />

          <Campo
            label="Província"
            value={form.provincia}
            onChange={(v) => setForm({ ...form, provincia: v })}
          />

          <Campo
            label="Tipo de serviço"
            value={form.tipo_servico}
            onChange={(v) => setForm({ ...form, tipo_servico: v })}
          />

          <Campo
            label="Salário/hora (JPY)"
            type="number"
            value={form.salario_hora_jpy}
            onChange={(v) => setForm({ ...form, salario_hora_jpy: v })}
          />

          <Campo
            label="Turno"
            value={form.turno}
            onChange={(v) => setForm({ ...form, turno: v })}
          />

          <Campo
            label="Escala"
            value={form.escala}
            onChange={(v) => setForm({ ...form, escala: v })}
          />

          <Campo
            label="Quantidade de vagas"
            type="number"
            value={form.quantidade_vagas}
            onChange={(v) => setForm({ ...form, quantidade_vagas: v })}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select
              value={form.status_vaga}
              onChange={(e) =>
                setForm({ ...form, status_vaga: e.target.value })
              }
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="Aberta">Aberta</option>
              <option value="Em seleção">Em seleção</option>
              <option value="Urgente">Urgente</option>
              <option value="Pausada">Pausada</option>
              <option value="Encerrada">Encerrada</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              checked={form.urgente}
              onChange={(e) =>
                setForm({ ...form, urgente: e.target.checked })
              }
            />
            <label className="text-sm font-medium">Marcar como urgente</label>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-sm font-medium">Observações</label>
            <textarea
              value={form.observacoes}
              onChange={(e) =>
                setForm({ ...form, observacoes: e.target.value })
              }
              className="min-h-[90px] w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={salvando}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar vaga"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Vagas cadastradas</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Carregando vagas...</p>
        ) : vagas.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma vaga cadastrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2">Empreiteira</th>
                  <th className="py-2">Vaga</th>
                  <th className="py-2">Local</th>
                  <th className="py-2">Salário</th>
                  <th className="py-2">Turno</th>
                  <th className="py-2">Escala</th>
                  <th className="py-2">Qtd.</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {vagas.map((vaga) => (
                  <tr key={vaga.id} className="border-b">
                    <td className="py-3">
                      <div className="font-medium">{vaga.titulo_vaga}</div>
                      {vaga.urgente && (
                        <span className="mt-1 inline-block rounded bg-red-100 px-2 py-1 text-xs text-red-700">
                          Urgente
                        </span>
                      )}
                      <td className="py-3">
  {vaga.empreiteiras?.nome || "-"}
</td>
                    </td>
                    <td className="py-3">
                      {vaga.cidade || "-"} / {vaga.provincia || "--"}
                    </td>
                    <td className="py-3">
                      {vaga.salario_hora_jpy
                        ? `¥ ${vaga.salario_hora_jpy}`
                        : "-"}
                    </td>
                    <td className="py-3">{vaga.turno || "-"}</td>
                    <td className="py-3">{vaga.escala || "-"}</td>
                    <td className="py-3">{vaga.quantidade_vagas || "-"}</td>
                    <td className="py-3">{vaga.status_vaga || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
    </div>
  );
}
