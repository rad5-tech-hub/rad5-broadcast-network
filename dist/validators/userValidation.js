"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalRequestSchema = exports.markUserAsPaidSchema = exports.createBookingSchema = exports.createAvailabilitySchema = exports.resetPasswordSchema = exports.forgetPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    fullName: joi_1.default.string().required().min(3),
    email: joi_1.default.string().required().email().min(6),
    password: joi_1.default.string().required().min(6),
    phoneNumber: joi_1.default.string()
        .required()
        .pattern(/^[0-9]{10,15}$/)
        .message("Phone number must be 11 to 15 digits long"),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().required().email().trim().lowercase(),
    password: joi_1.default.string().required().min(6),
});
exports.forgetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().required().email().trim().lowercase(),
});
// export const resetPasswordSchema = Joi.object({
//   password: Joi.string().min(6).required(),
//   confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
//     "any.only": "Passwords do not match",
//   }),
// });
exports.resetPasswordSchema = joi_1.default.object({
    password: joi_1.default.string().min(6).required(),
    confirmPassword: joi_1.default.any()
        .equal(joi_1.default.ref("password"))
        .required()
        .label("Confirm password")
        .messages({
        "any.only": "{{#label}} does not match",
    }),
});
const singleAvailabilitySchema = joi_1.default.object({
    dayOfWeek: joi_1.default.string()
        .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
        .required(),
    startTime: joi_1.default.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    endTime: joi_1.default.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    date: joi_1.default.date().optional(), // Optional if you're not using it in DB
});
exports.createAvailabilitySchema = joi_1.default.object({
    availability: joi_1.default.array().items(singleAvailabilitySchema).required(),
});
exports.createBookingSchema = joi_1.default.object({
    tutorId: joi_1.default.string().uuid().required(),
    date: joi_1.default.date().required(),
    startTime: joi_1.default.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/) // 24hr HH:mm
        .required(),
    endTime: joi_1.default.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
});
//wallet validation
exports.markUserAsPaidSchema = joi_1.default.object({
    userId: joi_1.default.string().uuid().required(),
    amountPaid: joi_1.default.number().positive().required(),
    commissionRate: joi_1.default.number().min(0).max(1).optional(),
});
exports.withdrawalRequestSchema = joi_1.default.object({
    agentId: joi_1.default.string().uuid().required(),
    amount: joi_1.default.number().positive().required(),
    description: joi_1.default.string().allow("", null),
});
