// models/withdrawal.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/db';

class Withdrawal extends Model {
  public id!: string;
  public agentId!: string;
  public amount!: number;
  public status!: 'pending' | 'approved' | 'rejected';
  public description?: string;
  public bankName!: string;
  public accountNumber!: string;
  public accountName!: string;
}

Withdrawal.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Agents', // must match the actual table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Withdrawal',
    tableName: 'Withdrawals',
  },
);

export default Withdrawal;
