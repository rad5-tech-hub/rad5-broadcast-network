import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db";

class Agent extends Model {
  public id!: string;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public phoneNumber!: number;
  public sharableLink!: string | null;
  public profileImage!:string |null
  public isVerified!: boolean;
  public isActive!: boolean;
  public verificationToken!: string | null;
  public googleId!: string | null;
  public resetToken!: string | null;
  public resetTokenExpires!: Date | null;
}

Agent.init(
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sharableLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Agents",
    modelName: "Agent",
  }
);

export default Agent;
