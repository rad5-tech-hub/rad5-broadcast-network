"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agentController_1 = require("../controllers/agentController");
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
router.post("/register", multer_1.upload.single("profileImage"), agentController_1.register);
//@ts-ignore
router.get("/verify-email-agent", agentController_1.verifyAgentEmail);
//@ts-ignore
router.post("/login", agentController_1.login);
//@ts-ignore
router.post("/forgot-password", agentController_1.forgotPassword);
//@ts-ignore
router.post("/reset-password/:token", agentController_1.resetPassword);
exports.default = router;
