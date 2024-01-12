import type { MigrationFn } from '../../types/Migrations.js';

export interface IMigration {
  name: string;
  up: MigrationFn;
  down: MigrationFn;
}