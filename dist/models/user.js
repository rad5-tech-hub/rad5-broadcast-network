"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../database/db"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    fullName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    track: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    agentId: {
        type: sequelize_1.DataTypes.UUID, // Foreign key to Agent
        allowNull: true,
        references: {
            model: "Agents", // Make sure the table name matches exactly
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
    },
}, {
    sequelize: db_1.default,
    tableName: "Users",
    modelName: "User",
});
exports.default = User;
