import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db";

class User extends Model {
  public id!: string;
  public fullName!: string;
  public email!: string;
  public phoneNubmer!: string;
  public track!: string;
  public agentId!: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    track: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    sequelize,
    tableName: "Users",
    modelName: "User",
  }
);

export default User;

