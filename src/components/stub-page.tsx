import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StubPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Em construção</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Este módulo faz parte do MVP do NT Operação CRM. A estrutura de banco já está pronta — a interface será habilitada nas próximas iterações.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
