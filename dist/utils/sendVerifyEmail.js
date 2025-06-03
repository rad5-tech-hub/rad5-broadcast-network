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
exports.sendVerificationEmailAgent = void 0;
const sendEmail_1 = require("./sendEmail");
// export const sendVerificationEmail = async (email: string, token: string) => {
//   const url = `${process.env.BASE_URL}/api/v1/auth/verify-email?token=${token}`;
//   const html = `<p>Click the link to verify your email:</p>
//                 <a href="${url}">${url}</a>`;
//   await sendEmail(email, "Verify your email", html);
// };
const sendVerificationEmailAgent = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${process.env.BASE_URL}/api/v1/agent/verify-email-agent?token=${token}`;
    const html = `<p>Click the link to verify your email:</p>
                <a href="${url}">${url}</a>`;
    yield (0, sendEmail_1.sendEmail)(email, "Verify your email", html);
});
exports.sendVerificationEmailAgent = sendVerificationEmailAgent;
