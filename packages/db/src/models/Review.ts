import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import {
  CommentParentType,
  PictureParentType,
  ReviewParentType,
  productRatingHighest,
  productRatingLowest
} from '@m-cafe-app/shared-constants';
import { DatabaseError } from '@m-cafe-app/utils';
import { User } from './User.js';
import { Comment } from './Comment.js';
import { Picture } from './Picture.js';
import { Facility } from './Facility.js';
import { Order } from './Order.js';
import { Product } from './Product.js';


export class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
  declare id: CreationOptional<number>;
  declare parentType: ReviewParentType;
  declare parentId: number;
  declare userId: ForeignKey<User['id']>;
  declare text: string;
  declare rating: number;
  declare author?: NonAttribute<User>;
  declare comments?: NonAttribute<Comment[]>;
  declare pictures?: NonAttribute<Picture[]>;
  declare parent?: NonAttribute<Facility | Order | Product>;
  declare facility?: NonAttribute<Facility>;
  declare order?: NonAttribute<Order>;
  declare product?: NonAttribute<Product>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initReviewModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Review.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        parentType: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(ReviewParentType)]
          },
          unique: 'review_unique'
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: 'review_unique'
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          unique: 'review_unique'
        },
        text: {
          type: DataTypes.STRING(5000),
          allowNull: true
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: productRatingLowest,
            max: productRatingHighest
          }
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
        modelName: 'review',
        indexes: [
          {
            unique: true,
            fields: ['parent_type', 'parent_id', 'user_id']
          }
        ],
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


export const initReviewAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Review.belongsTo(User, {
        foreignKey: 'userId',
        as: 'author'
      });

      // Foreign key applied to Comment; Review parentId refers to Facility, Product, or Order; Scope applied to Comment
      Review.hasMany(Comment, {
        foreignKey: 'parentId',
        sourceKey: 'id',
        as: 'comments',
        scope: {
          parentType: CommentParentType.Review
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Picture; Review parentId refers to Facility, Product, or Order; Scope applied to Picture
      Review.hasMany(Picture, {
        foreignKey: 'parentId',
        sourceKey: 'id',
        as: 'pictures',
        scope: {
          parentType: PictureParentType.Review
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Review; Review parentId refers to Facility; Scope applied to Review
      Review.belongsTo(Facility, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'facility', // mapped to parent in hooks
        scope: {
          parentType: ReviewParentType.Facility
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Review; Review parentId refers to Order; Scope applied to Review
      Review.belongsTo(Order, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'order', // mapped to parent in hooks
        scope: {
          parentType: ReviewParentType.Order
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Review; Review parentId refers to Product; Scope applied to Review
      Review.belongsTo(Product, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'product', // mapped to parent in hooks
        scope: {
          parentType: ReviewParentType.Product
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


export const initReviewHooks = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      const mapReviewParentKey = (instance: Review) => {
        switch (instance.parentType) {
          case ReviewParentType.Facility:
            if (instance.facility) {
              instance.parent = instance.facility;
            }
            break;
          case ReviewParentType.Product:
            if (instance.product) {
              instance.parent = instance.product;
            }
            break;
          case ReviewParentType.Order:
            if (instance.order) {
              instance.parent = instance.order;
            }
            break;
          default:
            throw new DatabaseError(`Review data corrupt: unknown parentType : ${instance.parentType}; instance: ${instance}`);
        }
        delete instance.product;
        delete instance.facility;
        delete instance.order;
      };

      Review.addHook('afterFind', findResult => {
        if (!findResult) return;
      
        if (!Array.isArray(findResult)) {
          mapReviewParentKey(findResult as Review);
          return;
        }
      
        for (const instance of findResult as Review[]) {
          mapReviewParentKey(instance);
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};