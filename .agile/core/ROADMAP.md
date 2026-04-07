# Visão de Produto v2.0: "divi Inteligente e Colaborativo"

O **divi** v1 estabeleceu a base de um aplicativo de controle financeiro pessoal sólido, focado em privacidade, funcionando offline (PWA + Dexie) e com sincronização backend via Supabase. A fundação de transações, orçamentos e relatórios está pronta.

A versão 2.0 visa transformar o **divi** de uma ferramenta passiva de registro para um assistente financeiro proativo, inteligente e colaborativo, mantendo a filosofia "privacy-first".

## Épicos (Ordenados por Prioridade)

### Epic 1: Motor de Insights Proativos Locais (Proactive Insights)
Transformar dados brutos em ações. O divi deve analisar localmente o padrão de gastos do usuário e alertá-lo sobre anomalias, risco de estourar o orçamento e oportunidades de economia, tudo rodando no client-side para manter a privacidade.
- Alertas de anomalia de gastos em categorias.
- Previsão de fim de mês baseada na run rate.
- Identificação de assinaturas ociosas.

### Epic 2: Rastreamento de Investimentos (Investment Tracking)
Expandir a visão patrimonial para além do fluxo de caixa e gestão de dívidas, permitindo o acompanhamento de carteiras de investimentos.
- Cadastro de ativos (renda fixa, variável, cripto).
- Atualização manual de cotações/saldos.
- Gráficos de alocação de portfólio.

### Epic 3: Orçamento Colaborativo (Collaborative Budgeting)
Permitir que casais ou famílias compartilhem a gestão de orçamentos e transações, mantendo o controle de permissões.
- Criação de "Espaços Compartilhados" ou "Famílias" via Supabase.
- Sincronização em tempo real de transações compartilhadas.
- Orçamentos de categoria a nível familiar.

### Epic 4: Relatórios Avançados e Exportação (Advanced Reports)
Aprofundar a capacidade analítica do usuário sobre o próprio dinheiro.
- Gráficos de tendências plurianuais.
- Relatório detalhado de "Cash Flow" mensal.
- Exportação avançada de dados para CSV/Excel com filtros personalizados.
