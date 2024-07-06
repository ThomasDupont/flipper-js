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
const crypto_1 = __importDefault(require("crypto"));
const redis_adapter_1 = require("./redis.adapter");
const redis_1 = require("../redis");
const parseConfig_1 = require("../parseConfig");
jest.mock('../redis');
const getRedisClientMock = redis_1.getRedisClient;
const redisClientMock = {
    set: jest.fn(),
    get: jest.fn()
};
describe('RedisAdapter', () => {
    beforeEach(() => {
        getRedisClientMock.mockClear();
    });
    it('should save feature config', () => __awaiter(void 0, void 0, void 0, function* () {
        const config = Object.assign(Object.assign({}, parseConfig_1.defaultConfig), { features: {
                feature1: true
            } });
        getRedisClientMock.mockResolvedValue(redisClientMock);
        const redisAdapter = new redis_adapter_1.RedisAdapter();
        yield redisAdapter.save(config);
        expect(getRedisClientMock).toHaveBeenCalledTimes(1);
        expect(redisClientMock.set).toHaveBeenCalledTimes(1);
        expect(redisClientMock.set).toHaveBeenCalledWith('flipper-js_' + crypto_1.default.createHash('md5').update('feature1').digest('hex'), 'true');
    }));
    it('should get feature status', () => __awaiter(void 0, void 0, void 0, function* () {
        getRedisClientMock.mockResolvedValue(redisClientMock);
        const hashKey = 'flipper-js_' + crypto_1.default.createHash('md5').update('feature1').digest('hex');
        const redisAdapter = new redis_adapter_1.RedisAdapter();
        yield redisAdapter.get('feature1');
        expect(getRedisClientMock).toHaveBeenCalledTimes(1);
        expect(redisClientMock.get).toHaveBeenCalledTimes(1);
        expect(redisClientMock.get).toHaveBeenCalledWith(hashKey);
    }));
});
