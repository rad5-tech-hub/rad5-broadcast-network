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
exports.sendNewReferralNotification = void 0;
const sendEmail_1 = require("./sendEmail");
const textHelpers_1 = require("./textHelpers");
/**
 * Sends an email to notify an agent that a new user registered with their referral link.
 * @param agent Object with agent's email and full name
 * @param user New user details (name, email, phone, track)
 */
const sendNewReferralNotification = (agent, user) => __awaiter(void 0, void 0, void 0, function* () {
    const html = `
    <h3>Hello ${(0, textHelpers_1.toSentenceCase)(agent.fullName)},</h3>
    <p>A new user just registered using your referral link:</p>
    <ul>
      <li><strong>Name:</strong> ${(0, textHelpers_1.toSentenceCase)(user.fullName)}</li>
      <li><strong>Email:</strong> ${user.email}</li>
      <li><strong>Phone:</strong> ${user.phoneNumber}</li>
      <li><strong>Track:</strong> ${user.track}</li>
    </ul>
    <p>Keep sharing your link to refer more people!</p>
    <p>– RAD5 Tech Team</p>
  `;
    yield (0, sendEmail_1.sendEmail)(agent.email, "New User Registered via Your Link", html);
});
exports.sendNewReferralNotification = sendNewReferralNotification;
