export interface ISyncEngine {
  trigger(): Promise<void>
  enqueueSync(): void
  pushDirtyRecords(): Promise<void>
  pullFromServer(): Promise<void>
}
