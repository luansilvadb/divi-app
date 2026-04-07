# AGILE LOG - Histórico do Projeto

## Sprint 0: Fundação e Infraestrutura (Concluída)
- Configuração do projeto com Vue 3, Vite, TypeScript e Tailwind CSS.
- Implementação da arquitetura limpa baseada em módulos.
- Integração com Supabase para autenticação e Dexie para storage local (Local-First).
- Criação dos módulos base: Dashboard, Transactions, Budgets e Goals (UI inicial).
- Padronização do sistema de busca e estados vazios.

### Decisões Arquiteturais
- **ADR 001:** Uso de Clean Architecture com camadas UI, Application, Domain e Infrastructure para garantir testabilidade e separação de interesses.
- **ADR 002:** Abordagem Local-First usando Dexie.js para persistência local e Supabase para sincronização opcional.
- **ADR 003:** Sistema de Injeção de Dependência manual para facilitar mocks em testes unitários.

### Débitos Técnicos
- [ ] Aumentar cobertura de testes unitários nos stores do Pinia (>80%).
- [ ] Refatorar componentes de UI duplicados entre módulos para o diretório `shared`.
