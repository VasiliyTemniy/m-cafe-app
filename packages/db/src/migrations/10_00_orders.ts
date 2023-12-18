import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';
import {
  OrderDeliveryType,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus
} from '@m-cafe-app/shared-constants';


export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('orders', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'facilities', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    // Overall estimated order delivery time, set by the backend
    estimated_delivery_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    delivery_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(OrderDeliveryType)]
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(OrderStatus)]
      },
    },
    total_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    archive_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customer_phonenumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(OrderPaymentMethod)]
      }
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(OrderPaymentStatus)]
      }
    },
    box_sizing_x: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    box_sizing_y: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    box_sizing_z: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'addresses', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    // Preferred deliver_at time, set by the customer. Makes sense for food delivery
    deliver_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    recieved_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    mass_control_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tracking_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('orders');
};