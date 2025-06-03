"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShareableLink = void 0;
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// export const  = (
//   fullName: string,
//   phoneNumber: string
// ): string => {
//   const slug = fullName
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");
//   const phoneSuffix = phoneNumber.slice(-4);
//   const randomId = uuidv4().split("-")[0]; // optional but helps uniqueness
//   return `${process.env.BASE_URL}/register/agent/${slug}-${phoneSuffix}-${randomId}`;;
// };
const generateShareableLink = (fullName, phoneNumber) => {
    const slug = fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const phoneSuffix = phoneNumber.slice(-4);
    const randomId = (0, uuid_1.v4)().split("-")[0];
    return `${slug}-${phoneSuffix}-${randomId}`;
};
exports.generateShareableLink = generateShareableLink;
