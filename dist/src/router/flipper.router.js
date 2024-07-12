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
        res.status(500).json({ message: 'API key not set' });
        return;
    }
    next();
};
router.use('/assets', (0, express_1.static)(path_1.default.join(__dirname, '../dist/flipper-ui/assets')));
router.get('/flipper-js', (_, res) => {
    res.sendFile('index.html', { root: path_1.default.join(__dirname, '../dist/flipper-ui') });
});
router.post('/flipper-js/login', checkApiKey, (0, validator_1.validate)({ postSchema: flipper_type_1.loginPostArgSchema }), (req, res) => {
    void (() => __awaiter(void 0, void 0, void 0, function* () {
        const { login, password } = req.parsedBody;
        const ok = yield user_1.User.checkPassword(login, password);
        if (!ok) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        res.json({ token: jsonwebtoken_1.default.sign({ login }, FLIPPER_API_KEY) });
    }))();
});
router.get('/flipper-js/auth/ping', checkApiKey, (0, auth_1.auth)(FLIPPER_API_KEY), (_, res) => {
    res.json({ message: 'pong' });
});
router.get('/flipper-js/features', checkApiKey, (0, auth_1.auth)(FLIPPER_API_KEY), (req, res) => {
    void (() => __awaiter(void 0, void 0, void 0, function* () {
        res.json({
            config: flipper_1.default.getConfig(),
            features: yield flipper_1.default.list()
        });
    }))();
});
router.post('/flipper-js/features/:feature/enable', checkApiKey, (0, auth_1.auth)(FLIPPER_API_KEY), (req, res) => {
    void (() => __awaiter(void 0, void 0, void 0, function* () {
        yield flipper_1.default.enable(req.params.feature);
        res.json({ message: 'Feature enabled' });
    }))();
});
router.post('/flipper-js/features/:feature/disable', checkApiKey, (0, auth_1.auth)(FLIPPER_API_KEY), (req, res) => {
    void (() => __awaiter(void 0, void 0, void 0, function* () {
        yield flipper_1.default.disable(req.params.feature);
        res.json({ message: 'Feature disabled' });
    }))();
});
exports.default = router;
