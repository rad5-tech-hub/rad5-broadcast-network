import Agent from './agent';
import User from './user';
import AgentWallet from './agentWallet';
import WalletTransaction from './walletTransaction';
import Withdrawal from './withdrawal'; // ✅ Add this

Agent.hasMany(User, { foreignKey: 'agentId', as: 'Users' });
User.belongsTo(Agent, { foreignKey: 'agentId', as: 'Agent' });

// Agent to Wallet: One-to-One
Agent.hasOne(AgentWallet, { foreignKey: 'agentId' });
AgentWallet.belongsTo(Agent, { foreignKey: 'agentId' });

// Agent to WalletTransaction: One-to-Many
Agent.hasMany(WalletTransaction, { foreignKey: 'agentId' });
WalletTransaction.belongsTo(Agent, { foreignKey: 'agentId' });

// ✅ Agent to Withdrawal: One-to-Many
Agent.hasMany(Withdrawal, { foreignKey: 'agentId' });
Withdrawal.belongsTo(Agent, { foreignKey: 'agentId' });

export { Agent, User, AgentWallet, WalletTransaction, Withdrawal };
