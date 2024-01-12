import type {
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { TagParentType, isTagParentType } from '@m-cafe-app/shared-constants';
import { Tag } from './Tag.js';


export class TagRelation extends Model<InferAttributes<TagRelation>, InferCreationAttributes<TagRelation>> {
  declare tagId: ForeignKey<Tag['id']>;
  declare parentId: number;
  declare parentType: TagParentType;
}


export const initTagRelationModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      TagRelation.init({
        tagId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          references: { model: 'tags', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        parentId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        parentType: {
          type: DataTypes.SMALLINT,
          primaryKey: true,
          allowNull: false,
          validate: {
            isTagParentTypeValidator(value: unknown) {
              if (!isTagParentType(value)) {
                throw new Error(`Invalid tag parent type: ${value}`);
              }
            }
          },
        },
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'tag_relation',
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};