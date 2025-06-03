"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../database/db"));
class AgentWallet extends sequelize_1.Model {
}
AgentWallet.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
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
    balance: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: db_1.default,
    modelName: "AgentWallet",
    tableName: "AgentWallets",
});
exports.default = AgentWallet;
