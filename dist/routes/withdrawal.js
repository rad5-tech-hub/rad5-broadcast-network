"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/withdrawalRoutes.ts
const express_1 = __importDefault(require("express"));
const withdrawalController_1 = require("../controllers/withdrawalController");
const router = express_1.default.Router();
//@ts-ignore
router.post("/request", withdrawalController_1.requestWithdrawal);
//@ts-ignore
router.put("/approve/:id", withdrawalController_1.approveOrRejectWithdrawal); // body: { action: "approve" or "reject" }
exports.default = router;
