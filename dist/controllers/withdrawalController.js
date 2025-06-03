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
exports.requestWithdrawal = exports.approveOrRejectWithdrawal = void 0;
const walletTransaction_1 = __importDefault(require("../models/walletTransaction"));
const withdrawal_1 = __importDefault(require("../models/withdrawal"));
const agentWallet_1 = __importDefault(require("../models/agentWallet"));
const agent_1 = __importDefault(require("../models/agent"));
const userValidation_1 = require("../validators/userValidation");
const sendAgentNotification_1 = require("../utils/sendAgentNotification"); // helper we'll create
const sendWithdrawalEmailToAdmin_1 = require("../utils/sendWithdrawalEmailToAdmin");
const db_1 = __importDefault(require("../database/db"));
const approveOrRejectWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { action } = req.body; // "approve" or "reject"
    const transaction = yield db_1.default.transaction();
    try {
        const withdrawal = yield withdrawal_1.default.findByPk(id, { transaction });
        if (!withdrawal) {
            yield transaction.rollback();
            return res.status(404).json({ message: 'Withdrawal request not found.' });
        }
        if (withdrawal.status !== 'pending') {
            yield transaction.rollback();
            return res.status(400).json({ message: 'Withdrawal already processed.' });
        }
        const wallet = yield agentWallet_1.default.findOne({
            where: { agentId: withdrawal.agentId },
            transaction,
        });
        const agent = yield agent_1.default.findByPk(withdrawal.agentId); // for email or phone
        if (!wallet || !agent) {
            yield transaction.rollback();
            return res
                .status(404)
                .json({ message: 'Agent wallet or profile not found.' });
        }
        if (action === 'approve') {
            if (wallet.balance < withdrawal.amount) {
                yield transaction.rollback();
                return res
                    .status(400)
                    .json({ message: 'Insufficient wallet balance for approval.' });
            }
            wallet.balance -= withdrawal.amount;
            yield wallet.save({ transaction });
            withdrawal.status = 'approved';
            yield withdrawal.save({ transaction });
            yield walletTransaction_1.default.create({
                agentId: withdrawal.agentId,
                type: 'debit',
                amount: withdrawal.amount,
                description: 'Withdrawal approved by admin',
            }, { transaction });
            yield (0, sendAgentNotification_1.sendAgentNotification)(agent, withdrawal.amount, 'approved');
        }
        else if (action === 'reject') {
            withdrawal.status = 'rejected';
            yield withdrawal.save({ transaction });
            yield (0, sendAgentNotification_1.sendAgentNotification)(agent, withdrawal.amount, 'rejected');
        }
        else {
            yield transaction.rollback();
            return res.status(400).json({ message: 'Invalid action' });
        }
        yield transaction.commit();
        return res
            .status(200)
            .json({ message: `Withdrawal ${action}d successfully`, withdrawal });
    }
    catch (err) {
        yield transaction.rollback();
        return res
            .status(500)
            .json({ message: 'Error processing withdrawal', error: err.message });
    }
});
exports.approveOrRejectWithdrawal = approveOrRejectWithdrawal;
//request
const requestWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = userValidation_1.withdrawalRequestSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });
    const { agentId, amount, description } = req.body;
    try {
        const wallet = yield agentWallet_1.default.findOne({ where: { agentId } });
        //  Handle where wallet does not exist separately from insufficient balance
        if (!wallet) {
            return res.status(404).json({ message: 'Agent wallet not found.' });
        }
        // Check if agent has sufficient balance
        if (wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient wallet balance.' });
        }
        const withdrawal = yield withdrawal_1.default.create({
            agentId,
            amount,
            description,
            status: 'pending',
        });
        // ✅ Optional: Send email to admin
        yield (0, sendWithdrawalEmailToAdmin_1.sendWithdrawalEmailToAdmin)(agentId, amount, description);
        return res.status(201).json({
            message: 'Withdrawal request submitted.',
            withdrawal,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error creating withdrawal',
            error: err.message,
        });
    }
});
exports.requestWithdrawal = requestWithdrawal;
