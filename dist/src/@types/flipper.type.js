"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtUserSchema = exports.loginPostArgSchema = void 0;
const zod_1 = require("zod");
exports.loginPostArgSchema = zod_1.z.object({
    login: zod_1.z.string(),
    password: zod_1.z.string()
});
exports.jwtUserSchema = zod_1.z.object({
    login: zod_1.z.string().min(1, 'Login cannot be empty')
});
