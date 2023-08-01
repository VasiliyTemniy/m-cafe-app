import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from '@m-cafe-app/shared-backend-deps/sequelize.js';

export class LocString extends Model<InferAttributes<LocString>, InferCreationAttributes<LocString>> {
  declare id: CreationOptional<number>;
  declare ruString: string;
  declare enString?: string;
  declare altString?: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}