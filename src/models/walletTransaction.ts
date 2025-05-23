import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db";

class WalletTransaction extends Model {
  public id!: string;
  public agentId!: string;
  public type!: "credit" | "debit";
  public amount!: number;
  public description!: string;
}

WalletTransaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Agents", // Make sure the table name matches exactly
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    type: {
      type: DataTypes.ENUM("credit", "debit"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "WalletTransaction",
    tableName: "WalletTransactions",
  }
);

export default WalletTransaction;
