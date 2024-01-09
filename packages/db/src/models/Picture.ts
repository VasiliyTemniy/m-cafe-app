import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import {
  LocParentType,
  LocType,
  PictureParentType,
  TagParentType,
  ViewParentType,
  isPictureParentType
} from '@m-cafe-app/shared-constants';
import { DatabaseError } from '@m-cafe-app/utils';
import { Loc } from './Loc.js';
import { Ingredient } from './Ingredient.js';
import { Facility } from './Facility.js';
import { Product } from './Product.js';
import { Review } from './Review.js';
import { User } from './User.js';
import { DynamicModule } from './DynamicModule.js';
import { View } from './View.js';
import { Tag } from './Tag.js';


export class Picture extends Model<InferAttributes<Picture>, InferCreationAttributes<Picture>> {
  declare id: CreationOptional<number>;
  declare src: string;
  declare parentId: number;
  declare parentType: PictureParentType;
  declare orderNumber: number;
  declare totalDownloads: number;
  declare url: string | null;
  declare altTextLocs?: NonAttribute<Loc[]>;
  declare parent?: NonAttribute<Review | Product | Facility | Ingredient | User | DynamicModule>;
  declare review?: NonAttribute<Review>;
  declare product?: NonAttribute<Product>;
  declare facility?: NonAttribute<Facility>;
  declare ingredient?: NonAttribute<Ingredient>;
  declare user?: NonAttribute<User>;
  declare dynamicModule?: NonAttribute<DynamicModule>;
  declare views?: NonAttribute<View[]>;
  declare tags?: NonAttribute<Tag[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initPictureModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Picture.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        src: {
          type: DataTypes.STRING,
          allowNull: false
        },
        // alt text loc is referenced from locs table
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: 'picture_unique'
        },
        parentType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isPictureParentTypeValidator(value: unknown) {
              if (!isPictureParentType(value)) {
                throw new Error(`Invalid picture parent type: ${value}`);
              }
            }
          },
          unique: 'picture_unique'
        },
        orderNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          unique: 'picture_unique'
        },
        totalDownloads: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        url: {
          type: DataTypes.STRING,
          allowNull: true
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
        modelName: 'picture',
        indexes: [
          {
            unique: true,
            fields: ['parent_id', 'parent_type', 'order_number']
          }
        ],
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
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


export const initPictureAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Picture.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'altTextLocs',
        scope: {
          parentType: LocParentType.Picture,
          locType: LocType.Text
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Picture; Picture parentId refers to Review; Scope applied to Picture
      Picture.belongsTo(Review, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'review', // mapped to parent in hooks
        scope: {
          parentType: PictureParentType.Review
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Picture; Picture parentId refers to Product; Scope applied to Picture
      Picture.belongsTo(Product, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'product', // mapped to parent in hooks
        scope: {
          parentType: PictureParentType.Product
        },
        constraints: false,
        foreignKeyConstraint: false
      });
      
      // Foreign key applied to Picture; Picture parentId refers to Facility; Scope applied to Picture
      Picture.belongsTo(Facility, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'facility', // mapped to parent in hooks
        scope: {
          parentType: PictureParentType.Facility
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Picture; Picture parentId refers to Ingredient; Scope applied to Picture
      Picture.belongsTo(Ingredient, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'ingredient', // mapped to parent in hooks
        scope: {
          parentType: PictureParentType.Ingredient
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Picture; Picture parentId refers to User; Scope applied to Picture
      Picture.belongsTo(User, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'user', // mapped to parent in hooks
        scope: {
          parentType: PictureParentType.User
        },
        constraints: false,
        foreignKeyConstraint: false
      });
      
      // Foreign key applied to Picture; Picture parentId refers to DynamicModule; Scope applied to Picture
      Picture.belongsTo(DynamicModule, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'dynamicModule', // mapped to parent in hooks
        scope: {
          parentType: PictureParentType.DynamicModule
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Picture.hasMany(View, {
        foreignKey: 'parentId',
        as: 'views',
        scope: {
          parentType: ViewParentType.Picture
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Picture.hasMany(Tag, {
        foreignKey: 'parentId',
        as: 'tags',
        scope: {
          parentType: TagParentType.Picture
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initPictureHooks = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      const mapPictureKey = (instance: Picture) => {
        switch (instance.parentType) {
          case PictureParentType.Review:
            if (instance.review) {
              instance.parent = instance.review;
            }
            break;
          case PictureParentType.Product:
            if (instance.product) {
              instance.parent = instance.product;
            }
            break;
          case PictureParentType.Facility:
            if (instance.facility) {
              instance.parent = instance.facility;
            }
            break;
          case PictureParentType.Ingredient:
            if (instance.ingredient) {
              instance.parent = instance.ingredient;
            }
            break;
          case PictureParentType.User:
            if (instance.user) {
              instance.parent = instance.user;
            }
            break;
          case PictureParentType.DynamicModule:
            if (instance.dynamicModule) {
              instance.parent = instance.dynamicModule;
            }
            break;
          default:
            throw new DatabaseError(`Picture data corrupt: unknown parentType : ${instance.parentType}`);
        }
      };

      Picture.addHook('afterFind', findResult => {
        if (!findResult) return;

        if (!Array.isArray(findResult)) {
          mapPictureKey(findResult as Picture);
          return;
        }

        for (const instance of findResult as Picture[]) {
          mapPictureKey(instance);
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};