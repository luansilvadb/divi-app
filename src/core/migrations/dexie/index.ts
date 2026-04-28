import { MigrationRegistry } from '../MigrationRegistry'
import { migration001InitialSchema } from './001_initial_schema'
import { migration002AddTagsTotransactions } from './002_add_tags_to_transactions'
import { migration003ConvertToBigInt } from './003_convert_to_bigint'

/**
 * Central index for all Dexie migrations.
 * Import this module to register all migrations in the MigrationRegistry.
 *
 * To add a new migration:
 * 1. Create a new file (e.g., 003_your_change.ts)
 * 2. Import it here
 * 3. Add it to the `allMigrations` array
 */

const allMigrations = [
  migration001InitialSchema,
  migration002AddTagsTotransactions,
  migration003ConvertToBigInt,
]

// Register all migrations on import
allMigrations.forEach((migration) => MigrationRegistry.register(migration))

export { allMigrations }
