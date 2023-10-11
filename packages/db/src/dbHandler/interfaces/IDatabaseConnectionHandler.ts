export interface IDatabaseConnectionHandler {
  connect(): Promise<void>;
  pingDb(): Promise<void>;
  close(): Promise<void>;
  loadMigrations(): Promise<void>;
  runMigrations(): Promise<void>;
  rollbackMigration(): Promise<void>;
}