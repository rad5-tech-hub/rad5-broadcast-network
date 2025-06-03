"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/withdrawal.ts
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../database/db"));
class Withdrawal extends sequelize_1.Model {
}
Withdrawal.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    agentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Agents", // must match the actual table name
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: db_1.default,
    modelName: "Withdrawal",
    tableName: "Withdrawals",
});
exports.default = Withdrawal;
