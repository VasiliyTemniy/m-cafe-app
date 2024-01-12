import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import { ContactParentType, ContactTarget, ContactType, isContactParentType, isContactTarget, isContactType } from '@m-market-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.js';


export class Contact extends Model<InferAttributes<Contact>, InferCreationAttributes<Contact>> {
  declare id: CreationOptional<number>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare name: string;
  declare description: string;
  declare type: ContactType;
  declare target: ContactTarget;
  declare parentId: number;
  declare parentType: ContactParentType;
  declare value: string;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initContactModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Contact.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false
        },
        type: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isContactTypeValidator(value: unknown) {
              if (!isContactType(value)) {
                throw new Error(`Invalid contact type: ${value}`);
              }
            }
          },
        },
        target: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isContactTargetValidator(value: unknown) {
              if (!isContactTarget(value)) {
                throw new Error(`Invalid contact target: ${value}`);
              }
            }
          },
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        parentType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isContactParentTypeValidator(value: unknown) {
              if (!isContactParentType(value)) {
                throw new Error(`Invalid contact parent type: ${value}`);
              }
            }
          },
        },
        value: {
          type: DataTypes.STRING,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'contact',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        scopes: {
          raw: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initContactAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};