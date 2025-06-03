"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allWalletTransaction = exports.getAgentWalletAndTransactions = exports.markUserAsPaid = void 0;
const agentWallet_1 = __importDefault(require("../models/agentWallet"));
const walletTransaction_1 = __importDefault(require("../models/walletTransaction"));
const user_1 = __importDefault(require("../models/user"));
const agent_1 = __importDefault(require("../models/agent"));
const userValidation_1 = require("../validators/userValidation");
const markUserAsPaid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amountPaid, commissionRate = 0.1 } = req.body;
    const { error } = userValidation_1.markUserAsPaidSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    // Dynamic commission calculation (defaults to 10% if not provided)
    const commission = commissionRate * amountPaid;
    try {
        // 1. Find the user and ensure they belong to an agent
        const user = yield user_1.default.findByPk(userId);
        if (!user || !user.agentId) {
            return res.status(404).json({
                message: 'User or associated agent not found.',
            });
        }
        // 2. Find or create the agent's wallet
        let wallet = yield agentWallet_1.default.findOne({
            where: { agentId: user.agentId },
        });
        if (!wallet) {
            wallet = yield agentWallet_1.default.create({
                agentId: user.agentId,
                balance: commission, // Start with commission, not 0
            });
        }
        else {
            // If wallet exists, add commission to balance
            wallet.balance += commission;
            yield wallet.save();
        }
        // 3. Log the transaction
        yield walletTransaction_1.default.create({
            agentId: user.agentId,
            type: 'credit',
            amount: commission,
            description: `Commission (${commissionRate * 100}%) from payment for user ${user.fullName}`,
        });
        return res.status(200).json({
            message: 'Payment processed and agent credited',
            commission,
            walletBalance: wallet.balance,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error processing payment',
            error: err.message,
        });
    }
});
exports.markUserAsPaid = markUserAsPaid;
const getAgentWalletAndTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        // 1. Confirm agent exists (optional, for better error handling)
        const agent = yield agent_1.default.findByPk(agentId);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        // 2. Get wallet info
        const wallet = yield agentWallet_1.default.findOne({ where: { agentId } });
        // 3. Get transactions
        const transactions = yield walletTransaction_1.default.findAll({
            where: { agentId },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
        return res.status(200).json({
            message: 'Agent wallet and transaction history',
            agent: {
                id: agent.id,
                name: agent.fullName,
                email: agent.email,
            },
            wallet: {
                balance: (wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0,
            },
            transactions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAgentWalletAndTransactions = getAgentWalletAndTransactions;
//get all wallet transactions
const allWalletTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTransactions = yield walletTransaction_1.default.findAll();
        return res.status(200).json({
            messsage: `All Agents's transactions retrived successfully`,
            data: allTransactions,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch wallet or transactions',
            error: error.message,
        });
    }
});
exports.allWalletTransaction = allWalletTransaction;
