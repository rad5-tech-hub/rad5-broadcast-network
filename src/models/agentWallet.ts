import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db";

class AgentWallet extends Model {
  public id!: string;
  public agentId!: string;
  public balance!: number;
}

AgentWallet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agentId: {
      type: DataTypes.UUID, // Foreign key to Agent
      allowNull: true,
      references: {
        model: "Agents", // Make sure the table name matches exactly
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "AgentWallet",
    tableName: "AgentWallets",
  }
);

export default AgentWallet;
