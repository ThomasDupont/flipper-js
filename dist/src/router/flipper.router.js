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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const effect_1 = require("effect");
const express_1 = require("express");
const flipper_1 = __importDefault(require("../flipper"));
const user_1 = require("../user");
const auth_1 = require("./auth");
const validator_1 = require("./validator");
const flipper_type_1 = require("../@types/flipper.type");
const router = (0, express_1.Router)();
flipper_1.default.init();
router.use((0, express_1.json)());
const FLIPPER_API_KEY = (_a = process.env.FLIPPER_API_KEY) !== null && _a !== void 0 ? _a : '';
const checkApiKey = (req, res, next) => {
    if (FLIPPER_API_KEY.length === 0) {
        res.status(500).json({
            status: 'error',
            error: 'API key not set'
        });
        return;
    }
    next();
};
const login = (req, res) => {
    const { login, password } = req.parsedBody;
    void (0, effect_1.pipe)(effect_1.Effect.tryPromise(() => __awaiter(void 0, void 0, void 0, function* () { return yield user_1.User.checkPassword(login, password); })), effect_1.Effect.map(ok => {
        if (!ok) {
            res.status(401).json({
                status: 'error',
                error: 'Invalid credentials'
            });
            return effect_1.Effect.void;
        }
        res.json({
            status: 'success',
            token: jsonwebtoken_1.default.sign({ login }, FLIPPER_API_KEY)
        });
        return effect_1.Effect.void;
    }), effect_1.Effect.catchAll((e) => {
        console.error('Error checking password', e);
        res.status(401).json({
            status: 'error',
            error: 'Invalid credentials'
        });
        return effect_1.Effect.void;
    }), effect_1.Effect.runPromise);
};
const list = (req, res) => {
    void (0, effect_1.pipe)(effect_1.Effect.tryPromise(() => __awaiter(void 0, void 0, void 0, function* () { return yield flipper_1.default.list(); })), effect_1.Effect.map(features => res.json({
        status: 'success',
        features,
        config: flipper_1.default.getConfig()
    })), effect_1.Effect.catchAll((e) => {
        console.error('Error listing features', e);
        res.status(500).json({
            status: 'error',
            error: 'Error listing features'
        });
        return effect_1.Effect.void;
    }), effect_1.Effect.runPromise);
};
const activate = {
    activate: (feature) => __awaiter(void 0, void 0, void 0, function* () { yield flipper_1.default.enable(feature); }),
    deactivate: (feature) => __awaiter(void 0, void 0, void 0, function* () { yield flipper_1.default.disable(feature); })
};
const activateProgram = (type) => (req, res) => {
    const { feature } = req.params;
    void (0, effect_1.pipe)(effect_1.Effect.tryPromise(() => __awaiter(void 0, void 0, void 0, function* () { yield activate[type](feature); })), effect_1.Effect.map(() => res.json({
        status: 'success',
        message: `Feature ${type}d`
    })), effect_1.Effect.catchAll((e) => {
        console.error(`Error ${type}ing feature`, e);
        res.status(500).json({
            status: 'error',
            error: `Error ${type}ing feature`
        });
        return effect_1.Effect.void;
    }), effect_1.Effect.runPromise);
};
router.use('/assets', (0, express_1.static)(path_1.default.join(__dirname, '../../flipper-ui/assets')));
router.get('/flipper-js', (_, res) => {
    res.sendFile('index.html', { root: path_1.default.join(__dirname, '../../flipper-ui') });
});
router.get('/flipper-js/auth/ping', checkApiKey, (0, auth_1.auth)(FLIPPER_API_KEY), (_, res) => {
    res.json({ message: 'pong' });
});
router.post('/flipper-js/login', checkApiKey, (0, validator_1.validate)({ postSchema: flipper_type_1.loginPostArgSchema }), login);
router.get('/flipper-js/features', checkApiKey, (0, auth_1.auth)(FLIPPER_API_KEY), list);
router.post('/flipper-js/features/:feature/enable', checkApiKey, (0, auth_1.auth)(FLIPPER_API_KEY), activateProgram('activate'));
router.post('/flipper-js/features/:feature/disable', checkApiKey, (0, auth_1.auth)(FLIPPER_API_KEY), activateProgram('deactivate'));
exports.default = router;
