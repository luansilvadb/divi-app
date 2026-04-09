# SPRINT ATUAL: EPIC 3 (A Dança dos Números)

**Meta:** v0.4.0
**Status:** Aguardando Execução
**Tech Lead:** Usuário

> **Aviso ao Tech Lead:**
> Instruções estritas. Qualquer alteração neste arquivo deve ser apenas a marcação de `[x]` nas caixas de seleção. Dúvidas arquiteturais não são admitidas; apenas traduza as especificações abaixo em código. Referencie o arquivo `.agile/spec/TECHNICAL_SPEC_V0.4.0.md` para os detalhes exatos de implementação.

---

## MICRO-RFC: UX Sem Atrito e Auto-Categorização

### Tarefa 1: Serviço de Categorização Preditiva Local

- [ ] Implementar `IAutoCategorizationService` e sua versão concreta (`AutoCategorizationService`).
- [ ] Construir a lógica heurística (dicionário ponderado de palavras-chave -> categoria).
- [ ] Integrar o treinamento do serviço com a carga inicial de transações da store.

### Tarefa 2: Formulário de Inserção Rápida (Quick Add)

- [ ] Melhorar o formulário existente (ou criar um novo Modal) focado em usabilidade Mobile/Desktop.
- [ ] Adicionar auto-focus no campo numérico e atalho de teclado global (Desktop).
- [ ] Ligar o input de descrição/título ao serviço de predição para auto-selecionar a categoria reativamente.
