import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Pessoa {
  id: string;
  nome_completo: string;
  cpf: string | null;
  telefone_whatsapp: string | null;
  email: string | null;
  cidade: string | null;
  estado: string | null;
  origem_lead: string | null;
  status_geral: string | null;
  classificacao_risco: string | null;
  criado_em: string;
}

const initialForm = {
  nome_completo: "",
  cpf: "",
  telefone_whatsapp: "",
  email: "",
  cidade: "",
  estado: "",
  origem_lead: "WhatsApp",
  observacoes_gerais: "",
};

export function PassageirosPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);

  const { data: pessoas = [], isLoading } = useQuery({
    queryKey: ["pessoas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pessoas")
        .select("id,nome_completo,cpf,telefone_whatsapp,email,cidade,estado,origem_lead,status_geral,classificacao_risco,criado_em")
        .order("criado_em", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Pessoa[];
    },
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pessoas;
    return pessoas.filter((p) =>
      [p.nome_completo, p.cpf, p.telefone_whatsapp, p.email, p.cidade]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [pessoas, search]);

  const createPessoa = useMutation({
    mutationFn: async () => {
      if (!form.nome_completo.trim()) throw new Error("Informe o nome completo.");

      const { data: pessoa, error: pessoaError } = await supabase
        .from("pessoas")
        .insert({
          nome_completo: form.nome_completo.trim(),
          cpf: form.cpf.trim() || null,
          telefone_whatsapp: form.telefone_whatsapp.trim() || null,
          email: form.email.trim() || null,
          cidade: form.cidade.trim() || null,
          estado: form.estado.trim() || null,
          origem_lead: form.origem_lead,
          observacoes_gerais: form.observacoes_gerais.trim() || null,
          status_geral: "Lead novo",
          classificacao_risco: "Sem risco",
        })
        .select()
        .single();

      if (pessoaError) throw pessoaError;

      const ano = new Date().getFullYear();
      const codigo = `NT-${ano}-${String(Date.now()).slice(-6)}`;
      const { data: processo, error: processoError } = await supabase
        .from("processos")
        .insert({
          pessoa_id: pessoa.id,
          codigo_processo: codigo,
          ano_processo: ano,
          status_atual: "Lead novo",
          fase_atual: "Comercial",
          observacoes: "Processo criado automaticamente pelo cadastro de novo lead.",
        })
        .select()
        .single();

      if (processoError) throw processoError;

      const { error: historicoError } = await supabase.from("historico").insert({
        pessoa_id: pessoa.id,
        processo_id: processo.id,
        tipo_evento: "Criação de lead",
        descricao: `Lead criado e processo ${codigo} iniciado.`,
        status_novo: "Lead novo",
        observacao: form.observacoes_gerais.trim() || null,
      });

      if (historicoError) throw historicoError;

      return pessoa;
    },
    onSuccess: () => {
      toast.success("Lead criado com processo e histórico inicial.");
      setForm(initialForm);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["pessoas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pessoas / Leads</h1>
          <p className="text-muted-foreground">Cadastre leads, crie processos automaticamente e preserve o histórico.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo lead</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo lead</DialogTitle>
            </DialogHeader>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                createPessoa.mutate();
              }}
            >
              <div className="md:col-span-2 space-y-2">
                <Label>Nome completo</Label>
                <Input value={form.nome_completo} onChange={(e) => setForm({ ...form, nome_completo: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input value={form.telefone_whatsapp} onChange={(e) => setForm({ ...form, telefone_whatsapp: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Origem</Label>
                <Select value={form.origem_lead} onValueChange={(value) => setForm({ ...form, origem_lead: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Indicação">Indicação</SelectItem>
                    <SelectItem value="Formulário">Formulário</SelectItem>
                    <SelectItem value="Retorno antigo">Retorno antigo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Observações</Label>
                <Textarea value={form.observacoes_gerais} onChange={(e) => setForm({ ...form, observacoes_gerais: e.target.value })} />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={createPessoa.isPending}>{createPessoa.isPending ? "Salvando..." : "Salvar lead"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Lista de pessoas</CardTitle>
            <Input className="md:max-w-sm" placeholder="Buscar por nome, CPF, telefone, e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma pessoa cadastrada ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 pr-4">Nome</th>
                    <th className="py-3 pr-4">WhatsApp</th>
                    <th className="py-3 pr-4">Cidade/UF</th>
                    <th className="py-3 pr-4">Origem</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Risco</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{p.nome_completo}</td>
                      <td className="py-3 pr-4">{p.telefone_whatsapp || "—"}</td>
                      <td className="py-3 pr-4">{[p.cidade, p.estado].filter(Boolean).join("/") || "—"}</td>
                      <td className="py-3 pr-4">{p.origem_lead || "—"}</td>
                      <td className="py-3 pr-4"><Badge variant="secondary">{p.status_geral || "Lead novo"}</Badge></td>
                      <td className="py-3 pr-4"><Badge variant={p.classificacao_risco === "Sem risco" ? "outline" : "destructive"}>{p.classificacao_risco || "Sem risco"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
