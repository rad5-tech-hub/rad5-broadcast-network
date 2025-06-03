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
exports.sendTutorAdminNotification = void 0;
const sendEmail_1 = require("./sendEmail");
/**
 * Notifies the admin that a new tutor has registered.
 * @param adminEmail Admin email address
 * @param tutorName Full name of the tutor
 * @param tutorEmail Tutor's email address
 * @param tutorId ID of the tutor
 */
const sendTutorAdminNotification = (adminEmail, tutorName, tutorEmail, tutorId) => __awaiter(void 0, void 0, void 0, function* () {
    const dashboardUrl = `${process.env.ADMIN_DASHBOARD_URL}/tutors/${tutorId}`;
    const html = `
    <p>Hello Admin,</p>
    <p>A new tutor has registered and requires your approval:</p>
    <ul>
      <li><strong>Name:</strong> ${tutorName}</li>
      <li><strong>Email:</strong> ${tutorEmail}</li>
    </ul>
    <p>You can approve or reject this tutor by visiting the link below:</p>
    <a href="${dashboardUrl}">${dashboardUrl}</a>
  `;
    yield (0, sendEmail_1.sendEmail)(adminEmail, "New Tutor Approval Request", html);
});
exports.sendTutorAdminNotification = sendTutorAdminNotification;
