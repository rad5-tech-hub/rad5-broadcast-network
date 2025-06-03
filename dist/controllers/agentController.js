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
exports.resetPassword = exports.forgotPassword = exports.verifyAgentEmail = exports.login = exports.register = void 0;
const agent_1 = __importDefault(require("../models/agent"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userValidation_1 = require("../validators/userValidation");
require('dotenv').config();
const sendVerifyEmail_1 = require("../utils/sendVerifyEmail");
const sendPasswordResetEmail_1 = require("../utils/sendPasswordResetEmail");
const crypto_1 = __importDefault(require("crypto"));
const sequelize_1 = require("sequelize");
const slug_1 = require("../utils/slug");
const textHelpers_1 = require("../utils/textHelpers");
// register agent
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Validate user input
    const { error } = userValidation_1.registerSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    const { fullName, email, password, phoneNumber } = req.body;
    try {
        // Check if agent already exists
        const existingUser = yield agent_1.default.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Agent already exists' });
            return;
        }
        // Hash password
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        // Generate shareable link
        const sharableLink = (0, slug_1.generateShareableLink)(fullName, phoneNumber);
        // Get uploaded image URL from Cloudinary
        // const profileImage = req.file?.path || null;
        const profileImageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        // Save fullName in sentence case
        const formattedName = (0, textHelpers_1.toSentenceCase)(fullName);
        // Create new user
        const newUser = yield agent_1.default.create({
            fullName: formattedName,
            email,
            password: hashedPassword,
            phoneNumber,
            sharableLink,
            profileImage: profileImageUrl, // Save image URL
        });
        // Generate verification token
        const payLoad = { id: newUser.id };
        const generateVerificationToken = jsonwebtoken_1.default.sign(payLoad, process.env.SECRET, { expiresIn: '1h' });
        yield newUser.update({ verificationToken: generateVerificationToken });
        yield (0, sendVerifyEmail_1.sendVerificationEmailAgent)(newUser.email, generateVerificationToken);
        res.status(200).json({
            message: 'Agent registered successfully',
            data: newUser,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error', details: error });
    }
});
exports.register = register;
//login user with email and password
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //validate input
    const { error } = userValidation_1.loginSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    try {
        const { email, password } = req.body;
        //check if user exist
        const user = yield agent_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: `Invalid Credentials` });
            return;
        }
        //check if password matches
        const isPasswordMatch = bcryptjs_1.default.compareSync(password, user.password);
        if (!isPasswordMatch) {
            res.status(400).json({ message: `Invalid Credentials` });
            return;
        }
        if (!user.isActive) {
            res.status(403).json({
                message: 'Your account has been deactivated. Please contact support.',
            });
            return;
        }
        // check if user has verified their email
        if (!user.isVerified) {
            res.status(401).json({ message: 'Please verify your email to log in.' });
            return;
        }
        //generate token for user
        const payLoad = {
            id: user.id,
        };
        const token = jsonwebtoken_1.default.sign(payLoad, process.env.SECRET);
        res
            .status(200)
            .json({ message: `User Logged in successfully`, token: token });
        return;
    }
    catch (error) {
        res.status(500).json({ error: 'Server error', details: error });
        return;
    }
});
exports.login = login;
//verify email
const verifyAgentEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: 'Invalid verification token' });
    }
    const agent = yield agent_1.default.findOne({ where: { verificationToken: token } });
    if (!agent) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
    agent.isVerified = true;
    agent.verificationToken = null;
    yield agent.save();
    res.status(200).json({ message: 'Agent email verified successfully' });
});
exports.verifyAgentEmail = verifyAgentEmail;
//forget password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //validate input
    const { error } = userValidation_1.forgetPasswordSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    try {
        const { email } = req.body;
        const user = yield agent_1.default.findOne({ where: { email } });
        if (!user)
            return res
                .status(200)
                .json({
                message: 'If user with this email exists, a reset link has be sent',
            });
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
        //update user with resetToken and resetTokenExpires
        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        yield user.save();
        //send reset password link via email
        yield (0, sendPasswordResetEmail_1.sendPasswordResetEmail)(user.email, resetToken);
        return res.status(200).json({ message: 'Password reset link sent' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.forgotPassword = forgotPassword;
//reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        const { password, confirmPassword } = req.body;
        const { error } = userValidation_1.resetPasswordSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        //fetch user by a token
        const user = yield agent_1.default.findOne({
            where: { resetToken: token, resetTokenExpires: { [sequelize_1.Op.gt]: new Date() } },
        });
        if (!user)
            return res.status(400).json({ message: 'Invalid or expired token' });
        //update user
        user.password = yield bcryptjs_1.default.hash(password, 10);
        (user.resetToken = null), (user.resetTokenExpires = null);
        yield user.save();
        return res.status(200).json({ message: 'Password reset successful' });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.resetPassword = resetPassword;
