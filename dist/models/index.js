"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransaction = exports.AgentWallet = exports.User = exports.Agent = void 0;
const agent_1 = __importDefault(require("./agent"));
exports.Agent = agent_1.default;
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const agentWallet_1 = __importDefault(require("./agentWallet"));
exports.AgentWallet = agentWallet_1.default;
const walletTransaction_1 = __importDefault(require("./walletTransaction"));
exports.WalletTransaction = walletTransaction_1.default;
agent_1.default.hasMany(user_1.default, { foreignKey: "agentId", as: "Users" });
user_1.default.belongsTo(agent_1.default, { foreignKey: "agentId", as: "Agent" });
// Agent to Wallet: One-to-One
agent_1.default.hasOne(agentWallet_1.default, { foreignKey: "agentId" });
agentWallet_1.default.belongsTo(agent_1.default, { foreignKey: "agentId" });
// Agent to WalletTransaction: One-to-Many
agent_1.default.hasMany(walletTransaction_1.default, { foreignKey: "agentId" });
walletTransaction_1.default.belongsTo(agent_1.default, { foreignKey: "agentId" });
