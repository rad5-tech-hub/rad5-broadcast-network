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
exports.sendPasswordResetEmail = void 0;
const sendEmail_1 = require("./sendEmail");
const sendPasswordResetEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const resetUrl = `${process.env.BASE_URL}/api/v1/auth/reset-password?token=${token}`;
    const html = `<p>Click the link to reset your password (expires in 10 minutes):</p>
                <a href="${resetUrl}">${resetUrl}</a>`;
    yield (0, sendEmail_1.sendEmail)(email, "Reset Your Password", html);
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
