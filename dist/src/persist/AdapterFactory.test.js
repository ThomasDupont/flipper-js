"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../redis");
const AdapterFactory_1 = require("./AdapterFactory");
const local_adapter_1 = require("./local.adapter");
const redis_adapter_1 = require("./redis.adapter");
jest.mock('../redis');
const getRedisClientMock = redis_1.getRedisClient;
describe('AdapterFactory', () => {
    beforeEach(() => {
        getRedisClientMock.mockClear();
    });
    it('should create a local adapter', () => {
        const factory = new AdapterFactory_1.AdapterFactory('local');
        expect(factory.getAdapter()).toBeInstanceOf(local_adapter_1.LocalAdapter);
    });
    it('should create a redis adapter', () => {
        const factory = new AdapterFactory_1.AdapterFactory('redis');
        expect(factory.getAdapter()).toBeInstanceOf(redis_adapter_1.RedisAdapter);
    });
    it('should throw error for invalid storage type', () => {
        expect(() => new AdapterFactory_1.AdapterFactory('invalid')).toThrowError('Invalid storage type');
    });
});
