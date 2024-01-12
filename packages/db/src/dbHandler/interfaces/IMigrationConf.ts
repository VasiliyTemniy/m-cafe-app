import type { SequelizeStorage } from 'umzug';
import type { QueryInterface } from 'sequelize';
import type { MigrationFn } from '../../types/Migrations';

export interface IMigrationConf {
    migrations: {
        name: string;
        up: MigrationFn;
        down: MigrationFn;
    }[];
    storage: SequelizeStorage;
    context: QueryInterface;
    logger: Console | undefined;
}