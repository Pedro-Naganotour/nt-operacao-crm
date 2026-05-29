import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";

type Empreiteira = {
  id: string;
  nome: string;
  responsavel: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  comissao_padrao_brl: number | null;
  comissao_padrao_jpy: number | null;
  forma_pagamento: string | null;
  observacoes: string | null;
  status: string | null;
};

const formInicial = {
  nome: "",
  responsavel: "",
  telefone: "",
  email: "",
  endereco: "",
  comissao_padrao_brl: "",
  comissao_padrao_jpy: "",
  forma_pagamento: "",
  observacoes: "",
  status: "Ativa",
};

export function EmpreiteirasPage() {
  const [empreiteiras, setEmpreiteiras] = useState<Empreiteira[]>([]);
  const [form, setForm] = useState(formInicial);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregarEmpreiteiras() {
    setLoading(true);

    const { data, error } = await supabase
      .from("empreiteiras")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      console.error("Erro ao carregar empreiteiras:", error);
      setEmpreiteiras([]);
    } else {
      setEmpreiteiras((data || []) as Empreiteira[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarEmpreiteiras();
  }, []);

  async function salvarEmpreiteira(event: React.FormEvent) {
    event.preventDefault();
    setSalvando(true);

    const { error } = await supabase.from("empreiteiras").insert({
      nome: form.nome,
      responsavel: form.responsavel || null,
      telefone: form.telefone || null,
      email: form.email || null,
      endereco: form.endereco || null,
      comissao_padrao_brl: form.comissao_padrao_brl
        ? Number(form.comissao_padrao_brl)
        : null,
      comissao_padrao_jpy: form.comissao_padrao_jpy
        ? Number(form.comissao_padrao_jpy)
        : null,
      forma_pagamento: form.forma_pagamento || null,
      observacoes: form.observacoes || null,
      status: form.status,
    });

    if (error) {
      alert("Erro ao salvar empreiteira.");
      console.error(error);
    } else {
      setForm(formInicial);
      await carregarEmpreiteiras();
    }

    setSalvando(false);
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Empreiteiras</h1>
        <p className="text-sm text-gray-500">
          Cadastro das empreiteiras parceiras da Nagano Tour.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Cadastrar empreiteira</h2>

        <form onSubmit={salvarEmpreiteira} className="grid gap-4 md:grid-cols-3">
          <Campo
            label="Nome da empreiteira"
            value={form.nome}
            onChange={(v) => setForm({ ...form, nome: v })}
            required
          />

          <Campo
            label="Responsável"
            value={form.responsavel}
            onChange={(v) => setForm({ ...form, responsavel: v })}
          />

          <Campo
            label="Telefone"
            value={form.telefone}
            onChange={(v) => setForm({ ...form, telefone: v })}
          />

          <Campo
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <Campo
            label="Comissão padrão BRL"
            type="number"
            value={form.comissao_padrao_brl}
            onChange={(v) => setForm({ ...form, comissao_padrao_brl: v })}
          />

          <Campo
            label="Comissão padrão JPY"
            type="number"
            value={form.comissao_padrao_jpy}
            onChange={(v) => setForm({ ...form, comissao_padrao_jpy: v })}
          />

          <Campo
            label="Forma de pagamento"
            value={form.forma_pagamento}
            onChange={(v) => setForm({ ...form, forma_pagamento: v })}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
              <option value="Suspensa">Suspensa</option>
            </select>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-sm font-medium">Endereço</label>
            <input
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
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
              {salvando ? "Salvando..." : "Salvar empreiteira"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Empreiteiras cadastradas</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Carregando empreiteiras...</p>
        ) : empreiteiras.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhuma empreiteira cadastrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2">Nome</th>
                  <th className="py-2">Responsável</th>
                  <th className="py-2">Contato</th>
                  <th className="py-2">Comissão</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {empreiteiras.map((empreiteira) => (
                  <tr key={empreiteira.id} className="border-b">
                    <td className="py-3 font-medium">{empreiteira.nome}</td>
                    <td className="py-3">{empreiteira.responsavel || "-"}</td>
                    <td className="py-3">
                      <div>{empreiteira.telefone || "-"}</div>
                      <div className="text-xs text-gray-500">
                        {empreiteira.email || ""}
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        BRL:{" "}
                        {empreiteira.comissao_padrao_brl
                          ? `R$ ${empreiteira.comissao_padrao_brl}`
                          : "-"}
                      </div>
                      <div>
                        JPY:{" "}
                        {empreiteira.comissao_padrao_jpy
                          ? `¥ ${empreiteira.comissao_padrao_jpy}`
                          : "-"}
                      </div>
                    </td>
                    <td className="py-3">{empreiteira.status || "-"}</td>
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
