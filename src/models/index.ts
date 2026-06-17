import Agent from './agent';
import User from './user';
import AgentWallet from './agentWallet';
import WalletTransaction from './walletTransaction';
import Withdrawal from './withdrawal'; 
import Course from './Course';
import Admin from './admin';
import AuditTrail from './AuditTrail';

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

//course
Admin.hasMany(Course, {
  foreignKey: 'createdBy',
  as: 'courses',
});

Course.belongsTo(Admin, {
  foreignKey: 'createdBy',
  as: 'creator',
});

export { Admin, Agent, AgentWallet, Course, User, WalletTransaction, Withdrawal, AuditTrail };
