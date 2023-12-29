import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { DetailGroupParentType, LocParentType, LocType } from '@m-cafe-app/shared-constants';
import { Loc } from './Loc.js';
import { User } from './User.js';
import { Product } from './Product.js';
import { Facility } from './Facility.js';
import { Organization } from './Organization.js';
import { Detail } from './Detail.js';


export class DetailGroup extends Model<InferAttributes<DetailGroup>, InferCreationAttributes<DetailGroup>> {
  declare id: CreationOptional<number>;
  declare parentId: ForeignKey<DetailGroup['id']>;
  declare parentType: DetailGroupParentType;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare product?: NonAttribute<Product>;
  declare organization?: NonAttribute<Organization>;
  declare facility?: NonAttribute<Facility>;
  declare details?: NonAttribute<Detail[]>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initDetailGroupModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      DetailGroup.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        parentType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          // validate: {
          //   isIn: [Object.values(DetailGroupParentType)]
          // }
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
        // name locs are referenced from locs table
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'detail_group',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
        },
        scopes: {
          all: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
          raw: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
          allWithTimestamps: {}
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initDetailGroupAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      DetailGroup.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.DetailGroup,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      DetailGroup.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor'
      });
      
      DetailGroup.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor'
      });

      DetailGroup.belongsTo(Product, {
        targetKey: 'id',
        foreignKey: 'parentId',
        as: 'product',
        scope: {
          parentType: DetailGroupParentType.Product
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      DetailGroup.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'parentId',
        as: 'organization',
        scope: {
          parentType: DetailGroupParentType.Organization
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      DetailGroup.belongsTo(Facility, {
        targetKey: 'id',
        foreignKey: 'parentId',
        as: 'facility',
        scope: {
          parentType: DetailGroupParentType.Facility
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      DetailGroup.hasMany(Detail, {
        foreignKey: 'detailGroupId',
        as: 'details',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};