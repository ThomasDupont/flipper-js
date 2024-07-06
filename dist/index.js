"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.FlipperRouter = exports.Flipper = void 0;
const flipper_1 = __importDefault(require("./src/flipper"));
exports.Flipper = flipper_1.default;
const flipper_router_1 = __importDefault(require("./src/router/flipper.router"));
exports.FlipperRouter = flipper_router_1.default;
const user_1 = require("./src/user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
