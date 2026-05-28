export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alertas: {
        Row: {
          created_at: string
          id: string
          mensagem: string
          pessoa_id: string | null
          processo_id: string | null
          resolvido: boolean
          severidade: string
          tipo: string
        }
        Insert: {
          created_at?: string
          id?: string
          mensagem: string
          pessoa_id?: string | null
          processo_id?: string | null
          resolvido?: boolean
          severidade?: string
          tipo: string
        }
        Update: {
          created_at?: string
          id?: string
          mensagem?: string
          pessoa_id?: string | null
          processo_id?: string | null
          resolvido?: boolean
          severidade?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alertas_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      candidaturas: {
        Row: {
          created_at: string
          data_apresentacao: string | null
          data_entrevista: string | null
          id: string
          motivo: string | null
          observacoes: string | null
          pessoa_id: string
          processo_id: string | null
          resultado: string | null
          updated_at: string
          vaga_id: string
        }
        Insert: {
          created_at?: string
          data_apresentacao?: string | null
          data_entrevista?: string | null
          id?: string
          motivo?: string | null
          observacoes?: string | null
          pessoa_id: string
          processo_id?: string | null
          resultado?: string | null
          updated_at?: string
          vaga_id: string
        }
        Update: {
          created_at?: string
          data_apresentacao?: string | null
          data_entrevista?: string | null
          id?: string
          motivo?: string | null
          observacoes?: string | null
          pessoa_id?: string
          processo_id?: string | null
          resultado?: string | null
          updated_at?: string
          vaga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidaturas_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidaturas_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidaturas_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      custos: {
        Row: {
          cobrar_empreiteira: boolean | null
          cobrar_passageiro: boolean | null
          comprovante_path: string | null
          created_at: string
          data_custo: string | null
          descricao: string | null
          forma_pagamento: string | null
          id: string
          observacoes: string | null
          pessoa_id: string
          processo_id: string | null
          quem_pagou: string | null
          status: Database["public"]["Enums"]["custo_status"]
          tipo: string
          updated_at: string
          valor_brl: number | null
          valor_jpy: number | null
        }
        Insert: {
          cobrar_empreiteira?: boolean | null
          cobrar_passageiro?: boolean | null
          comprovante_path?: string | null
          created_at?: string
          data_custo?: string | null
          descricao?: string | null
          forma_pagamento?: string | null
          id?: string
          observacoes?: string | null
          pessoa_id: string
          processo_id?: string | null
          quem_pagou?: string | null
          status?: Database["public"]["Enums"]["custo_status"]
          tipo: string
          updated_at?: string
          valor_brl?: number | null
          valor_jpy?: number | null
        }
        Update: {
          cobrar_empreiteira?: boolean | null
          cobrar_passageiro?: boolean | null
          comprovante_path?: string | null
          created_at?: string
          data_custo?: string | null
          descricao?: string | null
          forma_pagamento?: string | null
          id?: string
          observacoes?: string | null
          pessoa_id?: string
          processo_id?: string | null
          quem_pagou?: string | null
          status?: Database["public"]["Enums"]["custo_status"]
          tipo?: string
          updated_at?: string
          valor_brl?: number | null
          valor_jpy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "custos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      despachantes: {
        Row: {
          ativo: boolean
          cidade: string | null
          consulado: string | null
          contato: string | null
          created_at: string
          id: string
          nome: string
          observacoes: string | null
          prazo_medio: string | null
          updated_at: string
          valor_cobrado: number | null
        }
        Insert: {
          ativo?: boolean
          cidade?: string | null
          consulado?: string | null
          contato?: string | null
          created_at?: string
          id?: string
          nome: string
          observacoes?: string | null
          prazo_medio?: string | null
          updated_at?: string
          valor_cobrado?: number | null
        }
        Update: {
          ativo?: boolean
          cidade?: string | null
          consulado?: string | null
          contato?: string | null
          created_at?: string
          id?: string
          nome?: string
          observacoes?: string | null
          prazo_medio?: string | null
          updated_at?: string
          valor_cobrado?: number | null
        }
        Relationships: []
      }
      dividas_riscos: {
        Row: {
          created_at: string
          data_divida: string | null
          id: string
          motivo: string
          observacoes: string | null
          pessoa_id: string
          processo_id: string | null
          responsavel_id: string | null
          status: Database["public"]["Enums"]["divida_status"]
          updated_at: string
          valor_brl: number | null
          valor_jpy: number | null
        }
        Insert: {
          created_at?: string
          data_divida?: string | null
          id?: string
          motivo: string
          observacoes?: string | null
          pessoa_id: string
          processo_id?: string | null
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["divida_status"]
          updated_at?: string
          valor_brl?: number | null
          valor_jpy?: number | null
        }
        Update: {
          created_at?: string
          data_divida?: string | null
          id?: string
          motivo?: string
          observacoes?: string | null
          pessoa_id?: string
          processo_id?: string | null
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["divida_status"]
          updated_at?: string
          valor_brl?: number | null
          valor_jpy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dividas_riscos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dividas_riscos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dividas_riscos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          arquivo_nome: string | null
          arquivo_path: string | null
          created_at: string
          data_envio: string | null
          data_validade: string | null
          id: string
          observacoes: string | null
          pessoa_id: string
          processo_id: string | null
          responsavel_id: string | null
          status: Database["public"]["Enums"]["documento_status"]
          tipo: string
          updated_at: string
        }
        Insert: {
          arquivo_nome?: string | null
          arquivo_path?: string | null
          created_at?: string
          data_envio?: string | null
          data_validade?: string | null
          id?: string
          observacoes?: string | null
          pessoa_id: string
          processo_id?: string | null
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["documento_status"]
          tipo: string
          updated_at?: string
        }
        Update: {
          arquivo_nome?: string | null
          arquivo_path?: string | null
          created_at?: string
          data_envio?: string | null
          data_validade?: string | null
          id?: string
          observacoes?: string | null
          pessoa_id?: string
          processo_id?: string | null
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["documento_status"]
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      empreiteiras: {
        Row: {
          ativo: boolean
          comissao: string | null
          created_at: string
          email: string | null
          endereco: string | null
          forma_pagamento: string | null
          id: string
          nome: string
          observacoes: string | null
          responsavel: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          comissao?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          forma_pagamento?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          responsavel?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          comissao?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          forma_pagamento?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          responsavel?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fabricas: {
        Row: {
          cidade: string | null
          created_at: string
          empreiteira_id: string | null
          id: string
          nome: string
          observacoes: string | null
          provincia: string | null
          tipo_servico: string | null
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          empreiteira_id?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          provincia?: string | null
          tipo_servico?: string | null
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          created_at?: string
          empreiteira_id?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          provincia?: string | null
          tipo_servico?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fabricas_empreiteira_id_fkey"
            columns: ["empreiteira_id"]
            isOneToOne: false
            referencedRelation: "empreiteiras"
            referencedColumns: ["id"]
          },
        ]
      }
      faturas: {
        Row: {
          comprovante_path: string | null
          created_at: string
          data_envio: string | null
          data_recebimento: string | null
          data_vencimento: string | null
          empreiteira_id: string | null
          id: string
          observacoes: string | null
          pessoa_id: string
          processo_id: string | null
          status: Database["public"]["Enums"]["fatura_status"]
          tipo: string | null
          updated_at: string
          valor_brl: number | null
          valor_jpy: number | null
        }
        Insert: {
          comprovante_path?: string | null
          created_at?: string
          data_envio?: string | null
          data_recebimento?: string | null
          data_vencimento?: string | null
          empreiteira_id?: string | null
          id?: string
          observacoes?: string | null
          pessoa_id: string
          processo_id?: string | null
          status?: Database["public"]["Enums"]["fatura_status"]
          tipo?: string | null
          updated_at?: string
          valor_brl?: number | null
          valor_jpy?: number | null
        }
        Update: {
          comprovante_path?: string | null
          created_at?: string
          data_envio?: string | null
          data_recebimento?: string | null
          data_vencimento?: string | null
          empreiteira_id?: string | null
          id?: string
          observacoes?: string | null
          pessoa_id?: string
          processo_id?: string | null
          status?: Database["public"]["Enums"]["fatura_status"]
          tipo?: string | null
          updated_at?: string
          valor_brl?: number | null
          valor_jpy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faturas_empreiteira_id_fkey"
            columns: ["empreiteira_id"]
            isOneToOne: false
            referencedRelation: "empreiteiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faturas_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faturas_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      observacoes: {
        Row: {
          autor_id: string | null
          created_at: string
          id: string
          pessoa_id: string
          processo_id: string | null
          texto: string
        }
        Insert: {
          autor_id?: string | null
          created_at?: string
          id?: string
          pessoa_id: string
          processo_id?: string | null
          texto: string
        }
        Update: {
          autor_id?: string | null
          created_at?: string
          id?: string
          pessoa_id?: string
          processo_id?: string | null
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "observacoes_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacoes_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacoes_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      passagens: {
        Row: {
          aeroporto_chegada: string | null
          aeroporto_saida: string | null
          autorizacao_empreiteira: boolean | null
          bilhete_path: string | null
          companhia: string | null
          created_at: string
          data_voo: string | null
          horario_voo: string | null
          id: string
          localizador: string | null
          observacoes: string | null
          pessoa_id: string
          processo_id: string | null
          status: Database["public"]["Enums"]["passagem_status"]
          updated_at: string
          valor_brl: number | null
          valor_jpy: number | null
        }
        Insert: {
          aeroporto_chegada?: string | null
          aeroporto_saida?: string | null
          autorizacao_empreiteira?: boolean | null
          bilhete_path?: string | null
          companhia?: string | null
          created_at?: string
          data_voo?: string | null
          horario_voo?: string | null
          id?: string
          localizador?: string | null
          observacoes?: string | null
          pessoa_id: string
          processo_id?: string | null
          status?: Database["public"]["Enums"]["passagem_status"]
          updated_at?: string
          valor_brl?: number | null
          valor_jpy?: number | null
        }
        Update: {
          aeroporto_chegada?: string | null
          aeroporto_saida?: string | null
          autorizacao_empreiteira?: boolean | null
          bilhete_path?: string | null
          companhia?: string | null
          created_at?: string
          data_voo?: string | null
          horario_voo?: string | null
          id?: string
          localizador?: string | null
          observacoes?: string | null
          pessoa_id?: string
          processo_id?: string | null
          status?: Database["public"]["Enums"]["passagem_status"]
          updated_at?: string
          valor_brl?: number | null
          valor_jpy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "passagens_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passagens_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas: {
        Row: {
          bloqueado: boolean
          cidade: string | null
          clickhype_conversa_id: string | null
          clickhype_link: string | null
          codigo: number
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          email: string | null
          estado: string | null
          estado_civil: string | null
          foto_url: string | null
          grau_descendencia: string | null
          id: string
          nacionalidade: string | null
          nome_completo: string
          observacoes_internas: string | null
          origem_lead: string | null
          possui_conjuge: boolean | null
          possui_filhos: boolean | null
          primeiro_contato: string | null
          responsavel_id: string | null
          rg: string | null
          risco: Database["public"]["Enums"]["risco_nivel"]
          sexo: string | null
          status: Database["public"]["Enums"]["pessoa_status"]
          telefone: string | null
          ultima_mensagem: string | null
          ultimo_contato: string | null
          updated_at: string
          whatsapp_numero: string | null
        }
        Insert: {
          bloqueado?: boolean
          cidade?: string | null
          clickhype_conversa_id?: string | null
          clickhype_link?: string | null
          codigo?: number
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          estado?: string | null
          estado_civil?: string | null
          foto_url?: string | null
          grau_descendencia?: string | null
          id?: string
          nacionalidade?: string | null
          nome_completo: string
          observacoes_internas?: string | null
          origem_lead?: string | null
          possui_conjuge?: boolean | null
          possui_filhos?: boolean | null
          primeiro_contato?: string | null
          responsavel_id?: string | null
          rg?: string | null
          risco?: Database["public"]["Enums"]["risco_nivel"]
          sexo?: string | null
          status?: Database["public"]["Enums"]["pessoa_status"]
          telefone?: string | null
          ultima_mensagem?: string | null
          ultimo_contato?: string | null
          updated_at?: string
          whatsapp_numero?: string | null
        }
        Update: {
          bloqueado?: boolean
          cidade?: string | null
          clickhype_conversa_id?: string | null
          clickhype_link?: string | null
          codigo?: number
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          estado?: string | null
          estado_civil?: string | null
          foto_url?: string | null
          grau_descendencia?: string | null
          id?: string
          nacionalidade?: string | null
          nome_completo?: string
          observacoes_internas?: string | null
          origem_lead?: string | null
          possui_conjuge?: boolean | null
          possui_filhos?: boolean | null
          primeiro_contato?: string | null
          responsavel_id?: string | null
          rg?: string | null
          risco?: Database["public"]["Enums"]["risco_nivel"]
          sexo?: string | null
          status?: Database["public"]["Enums"]["pessoa_status"]
          telefone?: string | null
          ultima_mensagem?: string | null
          ultimo_contato?: string | null
          updated_at?: string
          whatsapp_numero?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_venda: {
        Row: {
          adaptando: boolean | null
          created_at: string
          data_contato: string | null
          gostando_fabrica: boolean | null
          id: string
          marco: string | null
          observacoes: string | null
          pessoa_id: string
          problema_empreiteira: boolean | null
          problema_moradia: boolean | null
          problema_saude: boolean | null
          processo_id: string | null
          proximo_contato: string | null
          responsavel_id: string | null
          risco_desistencia: boolean | null
          status: Database["public"]["Enums"]["posvenda_status"]
          trabalhando: boolean | null
          updated_at: string
        }
        Insert: {
          adaptando?: boolean | null
          created_at?: string
          data_contato?: string | null
          gostando_fabrica?: boolean | null
          id?: string
          marco?: string | null
          observacoes?: string | null
          pessoa_id: string
          problema_empreiteira?: boolean | null
          problema_moradia?: boolean | null
          problema_saude?: boolean | null
          processo_id?: string | null
          proximo_contato?: string | null
          responsavel_id?: string | null
          risco_desistencia?: boolean | null
          status?: Database["public"]["Enums"]["posvenda_status"]
          trabalhando?: boolean | null
          updated_at?: string
        }
        Update: {
          adaptando?: boolean | null
          created_at?: string
          data_contato?: string | null
          gostando_fabrica?: boolean | null
          id?: string
          marco?: string | null
          observacoes?: string | null
          pessoa_id?: string
          problema_empreiteira?: boolean | null
          problema_moradia?: boolean | null
          problema_saude?: boolean | null
          processo_id?: string | null
          proximo_contato?: string | null
          responsavel_id?: string | null
          risco_desistencia?: boolean | null
          status?: Database["public"]["Enums"]["posvenda_status"]
          trabalhando?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_venda_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_venda_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_venda_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      processos: {
        Row: {
          ano: number
          created_at: string
          data_abertura: string
          data_embarque: string | null
          despachante_id: string | null
          empreiteira_id: string | null
          fabrica_id: string | null
          id: string
          motivo_encerramento: string | null
          observacoes: string | null
          pessoa_id: string
          responsavel_id: string | null
          status: Database["public"]["Enums"]["processo_status"]
          status_kanban: Database["public"]["Enums"]["pessoa_status"]
          updated_at: string
        }
        Insert: {
          ano?: number
          created_at?: string
          data_abertura?: string
          data_embarque?: string | null
          despachante_id?: string | null
          empreiteira_id?: string | null
          fabrica_id?: string | null
          id?: string
          motivo_encerramento?: string | null
          observacoes?: string | null
          pessoa_id: string
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["processo_status"]
          status_kanban?: Database["public"]["Enums"]["pessoa_status"]
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          data_abertura?: string
          data_embarque?: string | null
          despachante_id?: string | null
          empreiteira_id?: string | null
          fabrica_id?: string | null
          id?: string
          motivo_encerramento?: string | null
          observacoes?: string | null
          pessoa_id?: string
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["processo_status"]
          status_kanban?: Database["public"]["Enums"]["pessoa_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "processos_despachante_id_fkey"
            columns: ["despachante_id"]
            isOneToOne: false
            referencedRelation: "despachantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processos_empreiteira_id_fkey"
            columns: ["empreiteira_id"]
            isOneToOne: false
            referencedRelation: "empreiteiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processos_fabrica_id_fkey"
            columns: ["fabrica_id"]
            isOneToOne: false
            referencedRelation: "fabricas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      status_historico: {
        Row: {
          autor_id: string | null
          created_at: string
          id: string
          observacao: string | null
          pessoa_id: string
          processo_id: string | null
          status_anterior: string | null
          status_novo: string
          tipo: string | null
        }
        Insert: {
          autor_id?: string | null
          created_at?: string
          id?: string
          observacao?: string | null
          pessoa_id: string
          processo_id?: string | null
          status_anterior?: string | null
          status_novo: string
          tipo?: string | null
        }
        Update: {
          autor_id?: string | null
          created_at?: string
          id?: string
          observacao?: string | null
          pessoa_id?: string
          processo_id?: string | null
          status_anterior?: string | null
          status_novo?: string
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "status_historico_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_historico_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_historico_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vagas: {
        Row: {
          beneficios: string | null
          cidade: string | null
          codigo: number
          created_at: string
          empreiteira_id: string | null
          escala: string | null
          fabrica_id: string | null
          id: string
          idade_maxima: number | null
          moradia: string | null
          observacoes: string | null
          provincia: string | null
          quantidade: number | null
          requisitos: string | null
          salario_hora: number | null
          sexo_aceito: string | null
          status: Database["public"]["Enums"]["vaga_status"]
          tipo_servico: string | null
          transporte: string | null
          turno: string | null
          updated_at: string
        }
        Insert: {
          beneficios?: string | null
          cidade?: string | null
          codigo?: number
          created_at?: string
          empreiteira_id?: string | null
          escala?: string | null
          fabrica_id?: string | null
          id?: string
          idade_maxima?: number | null
          moradia?: string | null
          observacoes?: string | null
          provincia?: string | null
          quantidade?: number | null
          requisitos?: string | null
          salario_hora?: number | null
          sexo_aceito?: string | null
          status?: Database["public"]["Enums"]["vaga_status"]
          tipo_servico?: string | null
          transporte?: string | null
          turno?: string | null
          updated_at?: string
        }
        Update: {
          beneficios?: string | null
          cidade?: string | null
          codigo?: number
          created_at?: string
          empreiteira_id?: string | null
          escala?: string | null
          fabrica_id?: string | null
          id?: string
          idade_maxima?: number | null
          moradia?: string | null
          observacoes?: string | null
          provincia?: string | null
          quantidade?: number | null
          requisitos?: string | null
          salario_hora?: number | null
          sexo_aceito?: string | null
          status?: Database["public"]["Enums"]["vaga_status"]
          tipo_servico?: string | null
          transporte?: string | null
          turno?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vagas_empreiteira_id_fkey"
            columns: ["empreiteira_id"]
            isOneToOne: false
            referencedRelation: "empreiteiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vagas_fabrica_id_fkey"
            columns: ["fabrica_id"]
            isOneToOne: false
            referencedRelation: "fabricas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_team_member: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "atendimento"
        | "documentacao"
        | "financeiro"
        | "operacional"
      custo_status:
        | "em_aberto"
        | "pago_nagano"
        | "pago_passageiro"
        | "reembolsado"
        | "a_cobrar"
        | "cobrado"
        | "recebido"
        | "prejuizo"
        | "cancelado"
      divida_status:
        | "sem_risco"
        | "atencao"
        | "desistiu_com_custo"
        | "deixou_divida"
        | "fugiu_japao"
        | "financiamento_nao_pago"
        | "processo_bloqueado"
        | "resolvido"
      documento_status:
        | "nao_solicitado"
        | "solicitado"
        | "recebido_foto"
        | "em_analise"
        | "pendente"
        | "aprovado"
        | "rejeitado"
        | "fisico_solicitado"
        | "fisico_recebido"
        | "vencido"
      fatura_status:
        | "nao_enviada"
        | "enviada"
        | "aguardando_pagamento"
        | "paga"
        | "parcialmente_paga"
        | "em_atraso"
        | "contestada"
        | "cancelada"
      passagem_status:
        | "nao_cotada"
        | "cotada"
        | "reservada"
        | "aguardando_autorizacao"
        | "autorizada"
        | "emitida"
        | "enviada"
        | "cancelada"
        | "remarcada"
      pessoa_status:
        | "lead_novo"
        | "ficha_enviada"
        | "ficha_preenchida"
        | "perfil_em_analise"
        | "em_busca_vaga"
        | "apresentado_empreiteira"
        | "entrevista_marcada"
        | "aguardando_resultado"
        | "aprovado_vaga"
        | "recusado_vaga"
        | "buscando_nova_vaga"
        | "em_documentacao"
        | "em_coe"
        | "em_visto"
        | "visto_concedido"
        | "visto_negado"
        | "em_embarque"
        | "embarcado"
        | "pos_venda"
        | "desistiu"
        | "arquivado"
        | "devedor"
        | "risco_financeiro"
        | "bloqueado"
      posvenda_status:
        | "aguardando_primeiro_contato"
        | "tudo_certo"
        | "atencao"
        | "insatisfeito"
        | "risco_desistencia"
        | "problema_resolvido"
        | "sem_contato"
        | "encerrado"
      processo_status:
        | "aberto"
        | "em_documentacao"
        | "em_coe"
        | "em_visto"
        | "em_embarque"
        | "embarcado"
        | "desistiu"
        | "arquivado"
        | "cancelado"
      risco_nivel: "sem_risco" | "atencao" | "alto" | "bloqueado"
      vaga_status: "aberta" | "em_selecao" | "urgente" | "pausada" | "encerrada"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "atendimento",
        "documentacao",
        "financeiro",
        "operacional",
      ],
      custo_status: [
        "em_aberto",
        "pago_nagano",
        "pago_passageiro",
        "reembolsado",
        "a_cobrar",
        "cobrado",
        "recebido",
        "prejuizo",
        "cancelado",
      ],
      divida_status: [
        "sem_risco",
        "atencao",
        "desistiu_com_custo",
        "deixou_divida",
        "fugiu_japao",
        "financiamento_nao_pago",
        "processo_bloqueado",
        "resolvido",
      ],
      documento_status: [
        "nao_solicitado",
        "solicitado",
        "recebido_foto",
        "em_analise",
        "pendente",
        "aprovado",
        "rejeitado",
        "fisico_solicitado",
        "fisico_recebido",
        "vencido",
      ],
      fatura_status: [
        "nao_enviada",
        "enviada",
        "aguardando_pagamento",
        "paga",
        "parcialmente_paga",
        "em_atraso",
        "contestada",
        "cancelada",
      ],
      passagem_status: [
        "nao_cotada",
        "cotada",
        "reservada",
        "aguardando_autorizacao",
        "autorizada",
        "emitida",
        "enviada",
        "cancelada",
        "remarcada",
      ],
      pessoa_status: [
        "lead_novo",
        "ficha_enviada",
        "ficha_preenchida",
        "perfil_em_analise",
        "em_busca_vaga",
        "apresentado_empreiteira",
        "entrevista_marcada",
        "aguardando_resultado",
        "aprovado_vaga",
        "recusado_vaga",
        "buscando_nova_vaga",
        "em_documentacao",
        "em_coe",
        "em_visto",
        "visto_concedido",
        "visto_negado",
        "em_embarque",
        "embarcado",
        "pos_venda",
        "desistiu",
        "arquivado",
        "devedor",
        "risco_financeiro",
        "bloqueado",
      ],
      posvenda_status: [
        "aguardando_primeiro_contato",
        "tudo_certo",
        "atencao",
        "insatisfeito",
        "risco_desistencia",
        "problema_resolvido",
        "sem_contato",
        "encerrado",
      ],
      processo_status: [
        "aberto",
        "em_documentacao",
        "em_coe",
        "em_visto",
        "em_embarque",
        "embarcado",
        "desistiu",
        "arquivado",
        "cancelado",
      ],
      risco_nivel: ["sem_risco", "atencao", "alto", "bloqueado"],
      vaga_status: ["aberta", "em_selecao", "urgente", "pausada", "encerrada"],
    },
  },
} as const
