"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const flipper_router_1 = __importDefault(require("../router/flipper.router"));
const user_1 = require("../user");
const app = (0, express_1.default)();
const PORT = 3999;
void user_1.User.addUser('admin', 'password');
app.use(flipper_router_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
