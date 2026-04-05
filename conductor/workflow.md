# Project Workflow

## Guiding Principles
1. **The Plan is the Source of Truth**: All work must be tracked in `plan.md`.
2. **Test-Driven Development**: Write unit tests before implementing functionality.
3. **High Code Coverage**: Aim for >80% code coverage for all modules.
4. **User Experience First**: Every decision should prioritize user experience.

## Task Workflow
All tasks follow a strict lifecycle:
1. **Select Task**: Choose the next available task from `plan.md`.
2. **Mark In Progress**: Update task status to `[~]`.
3. **Write Failing Tests (Red Phase)**: Create tests that define expected behavior.
4. **Implement to Pass Tests (Green Phase)**: Write minimum code to pass tests.
5. **Refactor**: Improve code quality while keeping tests green.
6. **Verify Coverage**: Ensure coverage targets are met.
7. **Commit Code Changes**: Stage and commit with descriptive message.
8. **Update Plan**: Mark task as complete `[x]` and record commit SHA.
9. **Commit Plan Update**: Commit the updated `plan.md`.

## Quality Gates
- [ ] All tests pass
- [ ] Code coverage >80%
- [ ] No linting errors
- [ ] Type safety enforced
- [ ] Mobile responsive (if applicable)
