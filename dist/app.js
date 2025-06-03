"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./database/db"));
const agentRoutes_1 = __importDefault(require("./routes/agentRoutes"));
const user_1 = __importDefault(require("./routes/user"));
const wallet_1 = __importDefault(require("./routes/wallet"));
const admin_1 = __importDefault(require("./routes/admin"));
const withdrawal_1 = __importDefault(require("./routes/withdrawal"));
require("./models/index");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
//sync database
db_1.default
    .authenticate()
    .then(() => {
    console.log("Database Connected.. ");
})
    .catch((error) => {
    console.log(" Error connecting to database:", error);
});
// Default route for testing
app.get("/", (_req, res) => {
    res.send("RBN API IS LIVE!");
});
app.use("/api/v1/agent", agentRoutes_1.default);
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/wallet", wallet_1.default);
app.use("/api/v1/admin", admin_1.default);
app.use("/api/v1/withdrawal", withdrawal_1.default);
exports.default = app;
