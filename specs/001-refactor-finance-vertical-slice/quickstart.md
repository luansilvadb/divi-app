# Quickstart: Desenvolvendo com Fatiamento Vertical

Para implementar uma nova funcionalidade (Ex: `investments`):

1. **Definir Domínio**: Crie entidades e contratos em `src/modules/investments/domain/`. Se forem globais, use `src/shared/domain/`.
2. **Implementar Infra**: Crie os repositórios Supabase em `src/modules/investments/infrastructure/`.
3. **Casos de Uso**: Implemente a lógica e Stores Pinia em `src/modules/investments/application/`.
4. **Interface**: Crie as views e componentes em `src/modules/investments/ui/`.
5. **Injeção**: Registre as dependências no `src/core/di.ts` usando tokens de string.
6. **Rotas**: Adicione a rota em `src/core/router/index.ts`.
