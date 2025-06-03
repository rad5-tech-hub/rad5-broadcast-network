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
exports.getUsersByAgent = exports.toggleAgentStatus = exports.getAllAgents = exports.loginAdmin = exports.createAdmin = void 0;
const admin_1 = __importDefault(require("../models/admin"));
const agent_1 = __importDefault(require("../models/agent"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
// admin/create
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const existing = yield admin_1.default.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: 'Admin already exists' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const admin = yield admin_1.default.create({
            fullName,
            email,
            password: hashedPassword,
            role: 'admin',
        });
        return res.status(201).json({ message: 'Admin created', admin });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: 'Error creating admin', error: err.message });
    }
});
exports.createAdmin = createAdmin;
//login admin
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const admin = yield admin_1.default.findOne({ where: { email } });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        return res.status(200).json({ message: 'Login successful', token });
    }
    catch (err) {
        return res.status(500).json({ message: 'Login error', error: err.message });
    }
});
exports.loginAdmin = loginAdmin;
// Get all agents
const getAllAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agents = yield agent_1.default.findAll();
        return res.status(200).json({ agents });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: 'Failed to fetch agents', error: error.message });
    }
});
exports.getAllAgents = getAllAgents;
// // Toggle agent active status
// export const deactivateAgentStatus = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const agent = await Agent.findByPk(id);
//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }
//     await agent.update({ isActive: false });
//     return res.status(200).json({
//       message: `Agent has been deactivated"`,
//       agent,
//     });
//   } catch (error: any) {
//     return res
//       .status(500)
//       .json({ message: "Failed to update agent status", error: error.message });
//   }
// };
// // activate agent active status
// export const activateAgentStatus = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const agent = await Agent.findByPk(id);
//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }
//     await agent.update({ isActive: true });
//     return res.status(200).json({
//       message: `Agent has been deactivated"`,
//       agent,
//     });
//   } catch (error: any) {
//     return res
//       .status(500)
//       .json({ message: "Failed to update agent status", error: error.message });
//   }
// };
const toggleAgentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const agent = yield agent_1.default.findByPk(id);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        yield agent.update({ isActive: !agent.isActive });
        const status = agent.isActive ? 'activated' : 'deactivated';
        return res.status(200).json({
            message: `Agent has been ${status}`,
            agent,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: 'Failed to update agent status', error: error.message });
    }
});
exports.toggleAgentStatus = toggleAgentStatus;
const getUsersByAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sharableLink } = req.params;
    try {
        const users = yield user_1.default.findAll({
            where: { sharableLink },
        });
        return res.status(200).json({ users });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: 'Failed to fetch users', error: error.message });
    }
});
exports.getUsersByAgent = getUsersByAgent;
