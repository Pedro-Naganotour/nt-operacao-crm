import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, FileText, AlertTriangle } from "lucide-react";

export function Dashboard() {
  const { data: pessoasCount } = useQuery({
    queryKey: ["dashboard", "pessoas"],
    queryFn: async () => {
      const { count, error } = await supabase.from("pessoas").select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: processosCount } = useQuery({
    queryKey: ["dashboard", "processos"],
    queryFn: async () => {
      const { count, error } = await supabase.from("processos").select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const cards = [
    { title: "Pessoas cadastradas", value: pessoasCount ?? "—", icon: Users },
    { title: "Processos criados", value: processosCount ?? "—", icon: Briefcase },
    { title: "Documentos pendentes", value: "0", icon: FileText },
    { title: "Alertas de risco", value: "0", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao NT Operação CRM.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
