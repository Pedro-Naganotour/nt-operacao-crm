
# NT Operação CRM — Plano do MVP

Sistema interno em português (Brasil), layout moderno, menu lateral, paleta azul escuro + branco + cinza claro, com dourado/vermelho para alertas. Backend real com Lovable Cloud (PostgreSQL + Auth + Storage).

Dada a dimensão do projeto, proponho construir em **3 entregas**. Esta primeira entrega é o **MVP funcional** que você pediu. Depois evoluímos Kanbans avançados, integrações e automações.

## Entrega 1 — MVP funcional (esta etapa)

**Infraestrutura**
- Ativar Lovable Cloud (banco, auth, storage)
- Schema relacional completo (ver abaixo) com RLS
- Autenticação por e-mail/senha + tabela `profiles` + `user_roles` (admin, atendimento, documentação, financeiro, operacional)
- Layout base: sidebar fixa, header, tema claro profissional

**Módulos no MVP**
1. **Login** + proteção de rotas
2. **Dashboard** com os indicadores principais (leads novos, em processo, documentação, COE, visto, embarque, embarcados, desistentes, dívida, risco, próximos embarques, documentos pendentes, processos parados, alertas)
3. **Passageiros / Leads** — lista com busca (nome, CPF, telefone, e-mail), filtros (status, risco), cadastro/edição completos, evitando duplicidade por CPF/telefone/e-mail
4. **Perfil do passageiro** com abas: Resumo, Dados, Histórico, Conversas/WhatsApp, Vagas, Documentos, COE/Visto, Financeiro, Dívidas, Passagem, Faturas, Pós-venda, Anexos, Observações
5. **Processos** — uma pessoa pode ter múltiplos processos (2024 desistiu, 2025 visto negado, 2026 embarcou); histórico permanente
6. **Documentos** — upload no Storage, status, validade, responsável
7. **Vagas** — CRUD, status, vínculo com empreiteira/fábrica
8. **Empreiteiras, Fábricas, Despachantes** — CRUDs
9. **Kanban Comercial, Documentação, COE/Visto, Embarque** — drag-and-drop salvando histórico
10. **Financeiro básico** — custos por passageiro/processo, resumo
11. **Dívida e Risco** — registro com destaque no perfil
12. **Passagem aérea** — controle e arquivo do bilhete
13. **Faturamento para empreiteira**
14. **Pós-venda** — check-ins 7/15/30/60/90 dias
15. **Alertas** automáticos básicos
16. Campos preparados para integração ClickHype (id da conversa, link, número, última mensagem, responsável)

## Estrutura do banco (resumo)

```
profiles, user_roles
pessoas            (cadastro único, histórico permanente)
processos          (vários por pessoa, com ano/status)
status_historico   (log imutável de mudanças)
empreiteiras, fabricas, despachantes
vagas              (FK empreiteira/fábrica)
candidaturas       (pessoa ↔ vaga ↔ entrevista ↔ resultado)
documentos         (FK pessoa/processo, arquivo no Storage)
custos             (FK processo, tipo, valor BRL/JPY, status)
dividas_riscos     (FK pessoa, motivo, valor, status)
passagens          (FK processo, voo, status, arquivo)
faturas            (FK processo/empreiteira, status)
pos_venda          (FK processo, check-ins)
observacoes        (FK pessoa, autor, data)
clickhype_conversas (FK pessoa, campos preparados)
alertas
```

Tudo com RLS, GRANTs corretos, e função `has_role()` security-definer.

## Entrega 2 (próxima conversa)
- Integração real ClickHype (webhook em `/api/public/clickhype`)
- Automação de alertas (cron + e-mail)
- Exportações, relatórios financeiros avançados
- Permissões granulares por módulo

## Entrega 3
- Integrações Google Drive / Sheets / Gmail / Calendar
- API de companhias aéreas
- Mobile-first refinado

---

**Confirmação:** posso seguir com a Entrega 1 (MVP) exatamente como descrito acima? Vou ativar o Lovable Cloud, criar todo o schema e construir os módulos listados em sequência.
