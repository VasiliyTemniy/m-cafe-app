import type {
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  NonAttribute,
  Sequelize
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Picture } from './Picture.js';


export class PictureView extends Model<InferAttributes<PictureView>, InferCreationAttributes<PictureView>> {
  declare userIp: string;
  declare pictureId: ForeignKey<Picture['id']>;
  declare count: number;
  declare picture?: NonAttribute<Picture>;
}


export const initPictureViewModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      PictureView.init({
        userIp: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false
        },
        pictureId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          references: { model: 'pictures', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        count: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'picture_view',
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initPictureViewAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      PictureView.belongsTo(Picture, {
        foreignKey: 'pictureId',
        targetKey: 'id',
        as: 'picture'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};