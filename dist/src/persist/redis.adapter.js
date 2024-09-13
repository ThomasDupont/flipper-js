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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisAdapter = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = require("../redis");
const KEY_PREFIX = 'flipper-js_';
class RedisAdapter {
    constructor() {
        this.initConfig = (_, config) => __awaiter(this, void 0, void 0, function* () {
            const awaitedRedisClient = yield this.redisClient;
            const statusInRedis = yield Promise.all(Object.entries(config.features).map((_a) => __awaiter(this, [_a], void 0, function* ([feature, status]) {
                const hashKey = this.hashKey(feature);
                const existingStatus = yield awaitedRedisClient.get(hashKey);
                if (existingStatus === null) {
                    yield awaitedRedisClient.set(hashKey, status.toString());
                    return { [feature]: status };
                }
                return { [feature]: existingStatus.toString() === 'true' };
            })));
            return Object.assign(Object.assign({}, config), { features: Object.assign({}, ...statusInRedis) });
        });
        this.hashKey = (feature) => `${KEY_PREFIX}${crypto_1.default.createHash('md5').update(feature).digest('hex')}`;
        this.redisClient = (0, redis_1.getRedisClient)();
    }
    save(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const awaitedRedisClient = yield this.redisClient;
            yield Promise.all(Object.entries(config.features).map((_a) => __awaiter(this, [_a], void 0, function* ([feature, status]) { return yield awaitedRedisClient.set(this.hashKey(feature), status.toString()); })));
            return config;
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const awaitedRedisClient = yield this.redisClient;
            const hashKey = this.hashKey(key);
            const status = yield awaitedRedisClient.get(hashKey);
            return (status === null || status === void 0 ? void 0 : status.toString()) === 'true';
        });
    }
}
exports.RedisAdapter = RedisAdapter;
