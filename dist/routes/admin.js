"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminAuth_1 = require("../middlewares/adminAuth");
const router = express_1.default.Router();
//@ts-ignore
router.post("/create", adminController_1.createAdmin);
//@ts-ignore
router.post("/login", adminController_1.loginAdmin);
//@ts-ignore
router.get("/agents", adminAuth_1.isAdmin, adminController_1.getAllAgents);
//@ts-ignore
router.patch('/agent/:id/status', adminAuth_1.isAdmin, adminController_1.toggleAgentStatus);
//@ts-ignore
router.get("/agent/:sharableLink/users", adminAuth_1.isAdmin, adminController_1.getUsersByAgent);
exports.default = router;
