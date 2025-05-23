import Agent from "./agent";
import User from "./user";

import AgentWallet from "./agentWallet";
import WalletTransaction from "./walletTransaction";

Agent.hasMany(User, { foreignKey: "agentId", as: "Users" });
User.belongsTo(Agent, { foreignKey: "agentId", as: "Agent" });

// Agent to Wallet: One-to-One
Agent.hasOne(AgentWallet, { foreignKey: "agentId" });
AgentWallet.belongsTo(Agent, { foreignKey: "agentId" });

// Agent to WalletTransaction: One-to-Many
Agent.hasMany(WalletTransaction, { foreignKey: "agentId" });
WalletTransaction.belongsTo(Agent, { foreignKey: "agentId" });

export { Agent, User, AgentWallet, WalletTransaction };
