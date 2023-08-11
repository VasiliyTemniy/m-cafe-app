import { Model, InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import { User } from './User.js';
import { Facility } from './Facility.js';

export class FacilityManager extends Model<InferAttributes<FacilityManager>, InferCreationAttributes<FacilityManager>> {
  declare userId: ForeignKey<User['id']>;
  declare facilityId: ForeignKey<Facility['id']>;
}