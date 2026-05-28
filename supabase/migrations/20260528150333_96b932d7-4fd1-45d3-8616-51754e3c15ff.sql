
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin','atendimento','documentacao','financeiro','operacional');

CREATE TYPE public.pessoa_status AS ENUM (
  'lead_novo','ficha_enviada','ficha_preenchida','perfil_em_analise','em_busca_vaga',
  'apresentado_empreiteira','entrevista_marcada','aguardando_resultado','aprovado_vaga','recusado_vaga',
  'buscando_nova_vaga','em_documentacao','em_coe','em_visto','visto_concedido','visto_negado',
  'em_embarque','embarcado','pos_venda','desistiu','arquivado','devedor','risco_financeiro','bloqueado'
);

CREATE TYPE public.risco_nivel AS ENUM ('sem_risco','atencao','alto','bloqueado');

CREATE TYPE public.processo_status AS ENUM (
  'aberto','em_documentacao','em_coe','em_visto','em_embarque','embarcado','desistiu','arquivado','cancelado'
);

CREATE TYPE public.vaga_status AS ENUM ('aberta','em_selecao','urgente','pausada','encerrada');

CREATE TYPE public.documento_status AS ENUM (
  'nao_solicitado','solicitado','recebido_foto','em_analise','pendente','aprovado','rejeitado',
  'fisico_solicitado','fisico_recebido','vencido'
);

CREATE TYPE public.custo_status AS ENUM (
  'em_aberto','pago_nagano','pago_passageiro','reembolsado','a_cobrar','cobrado','recebido','prejuizo','cancelado'
);

CREATE TYPE public.divida_status AS ENUM ('sem_risco','atencao','desistiu_com_custo','deixou_divida','fugiu_japao','financiamento_nao_pago','processo_bloqueado','resolvido');

CREATE TYPE public.passagem_status AS ENUM ('nao_cotada','cotada','reservada','aguardando_autorizacao','autorizada','emitida','enviada','cancelada','remarcada');

CREATE TYPE public.fatura_status AS ENUM ('nao_enviada','enviada','aguardando_pagamento','paga','parcialmente_paga','em_atraso','contestada','cancelada');

CREATE TYPE public.posvenda_status AS ENUM ('aguardando_primeiro_contato','tudo_certo','atencao','insatisfeito','risco_desistencia','problema_resolvido','sem_contato','encerrado');

-- ============ PROFILES & ROLES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), NEW.email);
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Profile policies
CREATE POLICY "profiles select team" ON public.profiles FOR SELECT TO authenticated USING (public.is_team_member(auth.uid()) OR id = auth.uid());
CREATE POLICY "profiles update self" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles admin all" ON public.profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "user_roles select self or admin" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_roles admin manage" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ CADASTROS ============
CREATE TABLE public.empreiteiras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  responsavel TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  comissao TEXT,
  forma_pagamento TEXT,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.fabricas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cidade TEXT,
  provincia TEXT,
  tipo_servico TEXT,
  empreiteira_id UUID REFERENCES public.empreiteiras(id) ON DELETE SET NULL,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.despachantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cidade TEXT,
  consulado TEXT,
  contato TEXT,
  valor_cobrado NUMERIC(10,2),
  prazo_medio TEXT,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ PESSOAS ============
CREATE TABLE public.pessoas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo SERIAL UNIQUE,
  nome_completo TEXT NOT NULL,
  foto_url TEXT,
  cpf TEXT UNIQUE,
  rg TEXT,
  data_nascimento DATE,
  sexo TEXT,
  estado_civil TEXT,
  nacionalidade TEXT DEFAULT 'Brasileira',
  grau_descendencia TEXT,
  possui_conjuge BOOLEAN DEFAULT false,
  possui_filhos BOOLEAN DEFAULT false,
  telefone TEXT,
  email TEXT,
  cidade TEXT,
  estado TEXT,
  origem_lead TEXT,
  responsavel_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status pessoa_status NOT NULL DEFAULT 'lead_novo',
  risco risco_nivel NOT NULL DEFAULT 'sem_risco',
  bloqueado BOOLEAN NOT NULL DEFAULT false,
  observacoes_internas TEXT,
  -- ClickHype integration fields (preparados)
  clickhype_conversa_id TEXT,
  clickhype_link TEXT,
  whatsapp_numero TEXT,
  ultima_mensagem TEXT,
  primeiro_contato TIMESTAMPTZ,
  ultimo_contato TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_pessoas_status ON public.pessoas(status);
CREATE INDEX idx_pessoas_risco ON public.pessoas(risco);
CREATE INDEX idx_pessoas_telefone ON public.pessoas(telefone);
CREATE INDEX idx_pessoas_email ON public.pessoas(email);

-- ============ PROCESSOS ============
CREATE TABLE public.processos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  status processo_status NOT NULL DEFAULT 'aberto',
  status_kanban pessoa_status NOT NULL DEFAULT 'lead_novo',
  empreiteira_id UUID REFERENCES public.empreiteiras(id) ON DELETE SET NULL,
  fabrica_id UUID REFERENCES public.fabricas(id) ON DELETE SET NULL,
  despachante_id UUID REFERENCES public.despachantes(id) ON DELETE SET NULL,
  responsavel_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  data_abertura DATE NOT NULL DEFAULT CURRENT_DATE,
  data_embarque DATE,
  motivo_encerramento TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_processos_pessoa ON public.processos(pessoa_id);
CREATE INDEX idx_processos_status ON public.processos(status);

-- ============ HISTÓRICO ============
CREATE TABLE public.status_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos(id) ON DELETE CASCADE,
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  tipo TEXT,
  observacao TEXT,
  autor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_historico_pessoa ON public.status_historico(pessoa_id);

CREATE TABLE public.observacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos(id) ON DELETE SET NULL,
  texto TEXT NOT NULL,
  autor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_obs_pessoa ON public.observacoes(pessoa_id);

-- ============ VAGAS ============
CREATE TABLE public.vagas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo SERIAL UNIQUE,
  empreiteira_id UUID REFERENCES public.empreiteiras(id) ON DELETE SET NULL,
  fabrica_id UUID REFERENCES public.fabricas(id) ON DELETE SET NULL,
  cidade TEXT,
  provincia TEXT,
  tipo_servico TEXT,
  salario_hora NUMERIC(10,2),
  turno TEXT,
  escala TEXT,
  sexo_aceito TEXT,
  idade_maxima INTEGER,
  quantidade INTEGER DEFAULT 1,
  requisitos TEXT,
  beneficios TEXT,
  moradia TEXT,
  transporte TEXT,
  observacoes TEXT,
  status vaga_status NOT NULL DEFAULT 'aberta',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.candidaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos(id) ON DELETE CASCADE,
  vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
  data_apresentacao DATE DEFAULT CURRENT_DATE,
  data_entrevista TIMESTAMPTZ,
  resultado TEXT,
  motivo TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_cand_pessoa ON public.candidaturas(pessoa_id);
CREATE INDEX idx_cand_vaga ON public.candidaturas(vaga_id);

-- ============ DOCUMENTOS ============
CREATE TABLE public.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL,
  arquivo_path TEXT,
  arquivo_nome TEXT,
  data_envio TIMESTAMPTZ DEFAULT now(),
  data_validade DATE,
  status documento_status NOT NULL DEFAULT 'solicitado',
  observacoes TEXT,
  responsavel_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_doc_pessoa ON public.documentos(pessoa_id);

-- ============ FINANCEIRO ============
CREATE TABLE public.custos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL,
  descricao TEXT,
  valor_brl NUMERIC(12,2) DEFAULT 0,
  valor_jpy NUMERIC(12,2) DEFAULT 0,
  data_custo DATE DEFAULT CURRENT_DATE,
  quem_pagou TEXT,
  forma_pagamento TEXT,
  cobrar_passageiro BOOLEAN DEFAULT false,
  cobrar_empreiteira BOOLEAN DEFAULT false,
  status custo_status NOT NULL DEFAULT 'em_aberto',
  comprovante_path TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_custos_pessoa ON public.custos(pessoa_id);

CREATE TABLE public.dividas_riscos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos(id) ON DELETE SET NULL,
  motivo TEXT NOT NULL,
  valor_brl NUMERIC(12,2) DEFAULT 0,
  valor_jpy NUMERIC(12,2) DEFAULT 0,
  data_divida DATE DEFAULT CURRENT_DATE,
  status divida_status NOT NULL DEFAULT 'atencao',
  observacoes TEXT,
  responsavel_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_div_pessoa ON public.dividas_riscos(pessoa_id);

-- ============ PASSAGEM AÉREA ============
CREATE TABLE public.passagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos(id) ON DELETE CASCADE,
  companhia TEXT,
  localizador TEXT,
  data_voo DATE,
  horario_voo TIME,
  aeroporto_saida TEXT,
  aeroporto_chegada TEXT,
  valor_brl NUMERIC(12,2),
  valor_jpy NUMERIC(12,2),
  status passagem_status NOT NULL DEFAULT 'nao_cotada',
  bilhete_path TEXT,
  autorizacao_empreiteira BOOLEAN DEFAULT false,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ FATURAS ============
CREATE TABLE public.faturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos(id) ON DELETE SET NULL,
  empreiteira_id UUID REFERENCES public.empreiteiras(id) ON DELETE SET NULL,
  tipo TEXT,
  valor_brl NUMERIC(12,2),
  valor_jpy NUMERIC(12,2),
  data_envio DATE,
  data_vencimento DATE,
  data_recebimento DATE,
  status fatura_status NOT NULL DEFAULT 'nao_enviada',
  comprovante_path TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ PÓS-VENDA ============
CREATE TABLE public.pos_venda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos(id) ON DELETE CASCADE,
  data_contato DATE DEFAULT CURRENT_DATE,
  marco TEXT,
  trabalhando BOOLEAN,
  gostando_fabrica BOOLEAN,
  adaptando BOOLEAN,
  problema_moradia BOOLEAN,
  problema_empreiteira BOOLEAN,
  problema_saude BOOLEAN,
  risco_desistencia BOOLEAN,
  observacoes TEXT,
  proximo_contato DATE,
  status posvenda_status NOT NULL DEFAULT 'aguardando_primeiro_contato',
  responsavel_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ ALERTAS ============
CREATE TABLE public.alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID REFERENCES public.pessoas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  severidade TEXT NOT NULL DEFAULT 'info',
  resolvido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ TRIGGERS updated_at ============
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'profiles','empreiteiras','fabricas','despachantes','pessoas','processos','vagas',
    'candidaturas','documentos','custos','dividas_riscos','passagens','faturas','pos_venda'
  ]) LOOP
    EXECUTE format('CREATE TRIGGER trg_%I_updated BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()', t, t);
  END LOOP;
END $$;

-- ============ GRANTS + RLS para todas as tabelas operacionais ============
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'empreiteiras','fabricas','despachantes','pessoas','processos','status_historico',
    'observacoes','vagas','candidaturas','documentos','custos','dividas_riscos',
    'passagens','faturas','pos_venda','alertas'
  ]) LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "%I team read" ON public.%I FOR SELECT TO authenticated USING (public.is_team_member(auth.uid()))', t, t);
    EXECUTE format('CREATE POLICY "%I team write" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_team_member(auth.uid()))', t, t);
    EXECUTE format('CREATE POLICY "%I team update" ON public.%I FOR UPDATE TO authenticated USING (public.is_team_member(auth.uid()))', t, t);
    EXECUTE format('CREATE POLICY "%I admin delete" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(),''admin''))', t, t);
  END LOOP;
END $$;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public) VALUES ('documentos','documentos', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "docs team read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'documentos' AND public.is_team_member(auth.uid()));
CREATE POLICY "docs team write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documentos' AND public.is_team_member(auth.uid()));
CREATE POLICY "docs team update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'documentos' AND public.is_team_member(auth.uid()));
CREATE POLICY "docs team delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documentos' AND public.is_team_member(auth.uid()));
