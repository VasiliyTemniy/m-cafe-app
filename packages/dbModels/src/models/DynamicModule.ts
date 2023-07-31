import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { LocString } from './LocString.js';
import { Picture } from './Picture.js';


export class DynamicModule extends Model<InferAttributes<DynamicModule>, InferCreationAttributes<DynamicModule>> {
  declare id: CreationOptional<number>;
  declare moduleType: string;
  declare locStringId?: ForeignKey<LocString['id']>;
  declare page: string;
  declare placement: number;
  declare className?: string;
  declare inlineCss?: string;
  declare pictureId?: ForeignKey<Picture['id']>;
  declare url?: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}