"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
//@ts-ignore
router.post("/register/:linkCode", userController_1.registerUserUnderAgent);
//@ts-ignore
router.get("/agent/:agentId", userController_1.getUsersUnderAgent);
exports.default = router;
