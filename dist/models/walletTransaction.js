"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../database/db"));
class WalletTransaction extends sequelize_1.Model {
}
WalletTransaction.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    agentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: "Agents", // Make sure the table name matches exactly
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("credit", "debit"),
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: db_1.default,
    modelName: "WalletTransaction",
    tableName: "WalletTransactions",
});
exports.default = WalletTransaction;
