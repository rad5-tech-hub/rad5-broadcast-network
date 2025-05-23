import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db";

class Admin extends Model {
  public id!: string;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public role!: string;
}

Admin.init(
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin",
    },
  },
  {
    sequelize,
    tableName: "Admin",
    modelName: "Admin",
  }
);

export default Admin;
