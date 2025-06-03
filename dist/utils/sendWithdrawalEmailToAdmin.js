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
exports.sendWithdrawalEmailToAdmin = void 0;
const sendEmail_1 = require("./sendEmail");
const agent_1 = __importDefault(require("../models/agent"));
const admin_1 = __importDefault(require("../models/admin"));
/**
 * Sends an email to the admin when a withdrawal request is made.
 * @param agentId ID of the agent making the withdrawal
 * @param amount Requested withdrawal amount
 * @param description Optional description
 */
const sendWithdrawalEmailToAdmin = (agentId, amount, description) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield agent_1.default.findByPk(agentId);
    if (!agent)
        return;
    const admin = yield admin_1.default.findOne({ where: { role: "admin" } });
    if (!admin || !admin.email)
        return;
    const html = `
    <p>Hello Admin,</p>
    <p><strong>${agent.fullName || "An agent"}</strong> has requested a withdrawal:</p>
    <ul>
      <li><strong>Agent Name:</strong> ${agent.fullName || ""} 
  </li>
      <li><strong>Email:</strong> ${agent.email}</li>
      <li><strong>Amount:</strong> ₦${amount.toLocaleString()}</li>
      <li><strong>Description:</strong> ${description || "N/A"}</li>
    </ul>
    <p>Please review and process this request on the admin dashboard.</p>
  `;
    yield (0, sendEmail_1.sendEmail)(admin.email, "New Withdrawal Request from Agent", html);
});
exports.sendWithdrawalEmailToAdmin = sendWithdrawalEmailToAdmin;
