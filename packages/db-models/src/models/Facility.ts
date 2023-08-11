import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import { Address } from './Address.js';
import { LocString } from './LocString.js';
import { Stock } from './Stock.js';
import { User } from './User.js';

export class Facility extends Model<InferAttributes<Facility>, InferCreationAttributes<Facility>> {
  declare id: CreationOptional<number>;
  declare addressId: ForeignKey<Address['id']>;
  declare nameLocId: ForeignKey<LocString['id']>;
  declare descriptionLocId: ForeignKey<LocString['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare address?: NonAttribute<Address>;  
  declare nameLoc?: NonAttribute<LocString>;
  declare descriptionLoc?: NonAttribute<LocString>;
  declare managers?: NonAttribute<User[]>;
  declare stocks?: NonAttribute<Stock[]>;
}


export type FacilityData = Omit<InferAttributes<Facility>, PropertiesCreationOptional>
  & { id: number; };