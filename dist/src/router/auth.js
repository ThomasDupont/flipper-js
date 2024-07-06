"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const effect_1 = require("effect");
const flipper_type_1 = require("../@types/flipper.type");
const getToken = (auth) => {
    if (auth !== null) {
        const parts = auth.split(' ');
        if (parts.length < 2) {
            return new Error('Wrong token provided');
        }
        return parts[1];
    }
    return new Error('No token provided');
};
const getTokenEffect = (auth) => (0, effect_1.pipe)(getToken(auth), result => result instanceof Error ? effect_1.Effect.fail(result) : effect_1.Effect.succeed(result));
const verifyTokenEffect = (secret) => (token) => effect_1.Effect.try({
    try: () => jsonwebtoken_1.default.verify(token, secret),
    catch: error => {
        if (error instanceof jsonwebtoken_1.JsonWebTokenError || error instanceof jsonwebtoken_1.TokenExpiredError || error instanceof jsonwebtoken_1.NotBeforeError) {
            return error;
        }
        return new Error(`Unexpected error: ${JSON.stringify(error)}`);
    }
});
const parseSchemaEffect = (undecoded) => (0, effect_1.pipe)(flipper_type_1.jwtUserSchema.safeParse(undecoded), parse => parse.success ? effect_1.Effect.succeed(parse.data) : effect_1.Effect.fail(parse.error));
const auth = (secret) => (req, res, next) => {
    var _a;
    (0, effect_1.pipe)(getTokenEffect((_a = req.headers.authorization) !== null && _a !== void 0 ? _a : null), effect_1.Effect.flatMap(verifyTokenEffect(secret)), effect_1.Effect.flatMap(parseSchemaEffect), effect_1.Effect.map(user => {
        req.parsedToken = user;
        next();
        return effect_1.Effect.void;
    }), effect_1.Effect.catchAll(error => {
        res.status(401).json({ error: error.message });
        return effect_1.Effect.void;
    }), effect_1.Effect.runSync);
};
exports.auth = auth;
