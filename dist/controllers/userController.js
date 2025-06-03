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
exports.getUsersUnderAgent = exports.registerUserUnderAgent = void 0;
const user_1 = __importDefault(require("../models/user"));
const agent_1 = __importDefault(require("../models/agent"));
const textHelpers_1 = require("../utils/textHelpers");
const sendNewReferralNotification_1 = require("../utils/sendNewReferralNotification");
const registerUserUnderAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, phoneNumber, track } = req.body;
    const { linkCode } = req.params;
    if (!fullName || !email || !phoneNumber || !track) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        // Find agent by referral link
        const agent = yield agent_1.default.findOne({ where: { sharableLink: linkCode } });
        if (!agent) {
            return res.status(404).json({ message: "Invalid or expired agent link" });
        }
        // Check if the user already exists
        const existingUser = yield user_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already registered" });
        }
        // Save fullName in sentence case
        const formattedName = (0, textHelpers_1.toSentenceCase)(fullName);
        // Register user under the agent
        const newUser = yield user_1.default.create({
            fullName: formattedName,
            email,
            phoneNumber,
            track,
            agentId: agent.id,
        });
        //send email notification to agent
        yield (0, sendNewReferralNotification_1.sendNewReferralNotification)(agent, {
            fullName: formattedName,
            email,
            phoneNumber,
            track,
        });
        return res.status(201).json({
            message: "User registered successfully under agent",
            user: newUser,
        });
    }
    catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            message: "Registration failed",
            error: error.message || "Unexpected error",
        });
    }
});
exports.registerUserUnderAgent = registerUserUnderAgent;
const getUsersUnderAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId } = req.params;
    try {
        const agent = yield agent_1.default.findByPk(agentId, {
            include: [
                {
                    model: user_1.default,
                    as: "Users", // this alias must match the one used in association if used
                },
            ],
        });
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }
        return res.status(200).json({
            message: "Users registered under this agent",
            agent: {
                id: agent.id,
                fullName: agent.fullName,
                email: agent.email,
            },
            users: agent.Users || [],
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to fetch users", error: error.message });
    }
});
exports.getUsersUnderAgent = getUsersUnderAgent;
