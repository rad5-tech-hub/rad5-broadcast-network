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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAgentNotification = void 0;
// utils/sendAgentNotification.ts
const sendEmail_1 = require("./sendEmail");
/**
 * Notifies an agent about the status of their withdrawal request.
 * @param agent Object with agent's email and first name
 * @param amount Withdrawal amount
 * @param status "approved" or "rejected"
 */
const sendAgentNotification = (agent, amount, status) => __awaiter(void 0, void 0, void 0, function* () {
    const html = `
    <p>Hi ${agent.firstName || "Agent"},</p>
    <p>Your withdrawal request of <strong>₦${amount.toLocaleString()}</strong> has been <strong>${status}</strong> by the admin.</p>
    ${status === "approved"
        ? "<p>Expect payment shortly.</p>"
        : "<p>Please contact support for clarification.</p>"}
    <p>Thank you,<br/>RBN Team</p>
  `;
    yield (0, sendEmail_1.sendEmail)(agent.email, `Withdrawal ${status.toUpperCase()}`, html);
});
exports.sendAgentNotification = sendAgentNotification;
