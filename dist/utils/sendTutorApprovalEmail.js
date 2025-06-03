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
exports.sendTutorApprovalEmail = void 0;
const sendEmail_1 = require("./sendEmail");
const sendTutorApprovalEmail = (email, fullName) => __awaiter(void 0, void 0, void 0, function* () {
    const html = `
    <p>Hi ${fullName},</p>
    <p>Congratulations! Your account has been approved by the admin.</p>
    <p>You can now log in and start using your dashboard.</p>
    <p>Regards,<br/>OGEM Team</p>
  `;
    yield (0, sendEmail_1.sendEmail)(email, "Your Tutor Account Has Been Approved", html);
});
exports.sendTutorApprovalEmail = sendTutorApprovalEmail;
