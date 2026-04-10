# ADR-002: Motor de Categorização Preditiva Local-First

> Status: Aceito | Data: 2026-04-10 | Versão: 0.3.0

## Contexto
Para atingir o objetivo de "inserção ultrarrápida", não podemos depender de chamadas de API para sugerir categorias ou preencher dados de transações recorrentes. A latência de rede quebraria a fluidez da UX.

## Decisão
Implementaremos um `PredictionEngine` que opera inteiramente no cliente.
1. **Heurística de Payee:** Mapeamento 1:1 entre Beneficiário (Payee) e Categoria baseado na última transação.
2. **Frequência Temporal:** Sugestão de contas/categorias baseada no horário e dia da semana (ex: 'Almoço' entre 11h-14h).
3. **Cache de Memória:** As regras de predição serão carregadas em memória no boot do módulo de transações para resposta instantânea (< 10ms).

## Alternativas Consideradas
1. **ML via Supabase Functions:** Rejeitado devido à latência de rede e dependência de conexão.
2. **Simple Last Used:** Muito limitado, não considera o contexto do beneficiário.

## Consequências
- **Positivas:** Resposta instantânea, privacidade total (dados de predição não saem do device), funcionamento offline.
- **Negativas/Riscos:** Aumento leve no consumo de memória RAM; necessidade de manter o Dexie sincronizado para que a predição funcione em múltiplos devices.
