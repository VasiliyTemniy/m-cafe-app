import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { DatabaseError } from '@m-cafe-app/utils';
import { CommentParentType, isCommentParentType } from '@m-cafe-app/shared-constants';
import { User } from './User.js';
import { Review } from './Review.js';
import { Order } from './Order.js';


export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<number>;
  declare text: string;
  declare parentId: number;
  declare parentType: CommentParentType;
  declare orderNumber: number;
  declare parentCommentId: ForeignKey<Comment['id']> | null;
  declare userId: ForeignKey<User['id']> | null;
  declare archiveUserName: string | null;
  declare blockedReason: string | null;
  declare author?: NonAttribute<User>;
  declare parentComment?: NonAttribute<Comment>;
  declare childComments?: NonAttribute<Comment[]>;
  declare parent?: NonAttribute<Review | Order>;
  declare order?: NonAttribute<Order>;
  declare review?: NonAttribute<Review>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initCommentModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Comment.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        text: {
          type: DataTypes.STRING(5000),
          allowNull: false
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        parentType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isCommentParentTypeValidator(value: unknown) {
              if (!isCommentParentType(value)) {
                throw new Error(`Invalid comment parent type: ${value}`);
              }
            }
          },
        },
        orderNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        parentCommentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'comments', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        archiveUserName: {
          type: DataTypes.STRING,
          allowNull: true
        },
        blockedReason: {
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
        modelName: 'comment',
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


export const initCommentAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Comment.belongsTo(User, {
        foreignKey: 'userId',
        as: 'author'
      });

      // target on the right side; target === parent;
      // 'parentCategoryId' is taken from the target on the right
      Comment.belongsTo(Comment, {
        targetKey: 'id',
        foreignKey: 'parentCommentId',
        as: 'parentComment'
      });

      // target on the right side; target === children;
      // 'parentCategoryId' is taken from the source on the left
      Comment.hasMany(Comment, {
        foreignKey: 'parentCommentId',
        as: 'childComments'
      });

      // Foreign key applied to Comment; Comment parentId refers to Review; Scope applied to Comment
      Comment.belongsTo(Review, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'review', // mapped to parent in hooks
        scope: {
          parentType: CommentParentType.Review
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Comment; Comment parentId refers to Order; Scope applied to Comment
      Comment.belongsTo(Order, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'order', // mapped to parent in hooks
        scope: {
          parentType: CommentParentType.Order
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


export const initCommentHooks = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      const mapCommentKey = (instance: Comment) => {
        switch (instance.parentType) {
          case CommentParentType.Order:
            if (instance.order) {
              instance.parent = instance.order;
            }
            break;
          case CommentParentType.Review:
            if (instance.review) {
              instance.parent = instance.review;
            }
            break;
          default:
            throw new DatabaseError(`Comment data corrupt: unknown parentType : ${instance.parentType}`);
        }
        delete instance.review;
        delete instance.order;
      };

      Comment.addHook('afterFind', findResult => {
        if (!findResult) return;

        if (!Array.isArray(findResult)) {
          mapCommentKey(findResult as Comment);
          return;
        }

        for (const instance of findResult as Comment[]) {
          mapCommentKey(instance);
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};