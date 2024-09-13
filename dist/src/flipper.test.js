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
const flipper_1 = __importDefault(require("./flipper"));
const parseConfig_1 = require("./parseConfig");
const options_type_1 = require("./@types/options.type");
const redis_1 = require("./redis");
jest.mock('./parseConfig');
jest.mock('./redis');
const getRedisClientMock = redis_1.getRedisClient;
const getFileConfigMock = parseConfig_1.getFileConfig;
const getMock = jest.fn();
const saveMock = jest.fn();
describe('Flipper class tests', () => {
    beforeEach(() => {
        getMock.mockRestore();
        saveMock.mockRestore();
        getFileConfigMock.mockClear();
        getRedisClientMock.mockClear();
        getRedisClientMock.mockResolvedValue({ set: saveMock, get: getMock });
    });
    it('should initialize with local adapter', () => __awaiter(void 0, void 0, void 0, function* () {
        getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: options_type_1.Adapter.Local } });
        yield flipper_1.default.init();
        expect(flipper_1.default.getConfig().storage.type).toBe('local');
    }));
    it('should initialize with redis adapter', () => __awaiter(void 0, void 0, void 0, function* () {
        getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: options_type_1.Adapter.Redis } });
        getMock.mockResolvedValueOnce(null);
        getMock.mockResolvedValueOnce(null);
        yield flipper_1.default.init();
        expect(flipper_1.default.getConfig().storage.type).toBe('redis');
    }));
    it('should list all features and their statuses (storage local)', () => __awaiter(void 0, void 0, void 0, function* () {
        getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: options_type_1.Adapter.Local } });
        getMock.mockResolvedValueOnce(false);
        getMock.mockResolvedValueOnce(true);
        yield flipper_1.default.init();
        const list = yield flipper_1.default.list();
        expect(list).toEqual({ feature1: false, feature2: true });
    }));
    it('should list all features and their statuses (storage redis)', () => __awaiter(void 0, void 0, void 0, function* () {
        const baseConfig = { features: { feature1: false, feature2: true }, storage: { type: options_type_1.Adapter.Redis } };
        getFileConfigMock.mockReturnValue(baseConfig);
        getMock.mockResolvedValueOnce(false); // for init
        getMock.mockResolvedValueOnce(true); // for init
        getMock.mockResolvedValueOnce(false);
        getMock.mockResolvedValueOnce(true);
        yield flipper_1.default.init();
        const list = yield flipper_1.default.list();
        expect(list).toEqual({ feature1: false, feature2: true });
        expect(JSON.stringify(flipper_1.default.getConfig())).toBe(JSON.stringify(baseConfig));
    }));
    it('should enable a feature (local storage)', () => __awaiter(void 0, void 0, void 0, function* () {
        getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: options_type_1.Adapter.Local } });
        saveMock.mockReturnValue({ features: { feature1: true, feature2: true }, storage: { type: options_type_1.Adapter.Local } });
        getMock.mockResolvedValue(true);
        yield flipper_1.default.init();
        yield flipper_1.default.enable('feature1');
        const list = yield flipper_1.default.list();
        expect(list).toEqual({ feature1: true, feature2: true });
    }));
    it('should disable a feature  (local storage)', () => __awaiter(void 0, void 0, void 0, function* () {
        getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: options_type_1.Adapter.Local } });
        saveMock.mockReturnValue({ features: { feature1: false, feature2: false }, storage: { type: options_type_1.Adapter.Local } });
        getMock.mockResolvedValue(false);
        yield flipper_1.default.init();
        yield flipper_1.default.disable('feature2');
        const list = yield flipper_1.default.list();
        expect(list).toEqual({ feature1: false, feature2: false });
    }));
    it('should enable a feature (redis storage)', () => __awaiter(void 0, void 0, void 0, function* () {
        getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: options_type_1.Adapter.Redis } });
        getMock.mockResolvedValueOnce(false); // for init
        getMock.mockResolvedValueOnce(true); // for init
        getMock.mockResolvedValueOnce(true);
        getMock.mockResolvedValueOnce(true);
        yield flipper_1.default.init();
        yield flipper_1.default.enable('feature1');
        const list = yield flipper_1.default.list();
        expect(list).toEqual({ feature1: true, feature2: true });
    }));
    it('should disable a feature  (redis storage)', () => __awaiter(void 0, void 0, void 0, function* () {
        getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: options_type_1.Adapter.Redis } });
        getMock.mockResolvedValueOnce(false); // for init
        getMock.mockResolvedValueOnce(true); // for init
        getMock.mockResolvedValueOnce(false);
        getMock.mockResolvedValueOnce(false);
        yield flipper_1.default.init();
        yield flipper_1.default.disable('feature2');
        const list = yield flipper_1.default.list();
        expect(list).toEqual({ feature1: false, feature2: false });
    }));
});
describe('Flipper test all process', () => {
    it('Should init', () => __awaiter(void 0, void 0, void 0, function* () {
        getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: options_type_1.Adapter.Redis } });
        getMock.mockResolvedValueOnce(false); // for init
        getMock.mockResolvedValueOnce(true); // for init
        yield flipper_1.default.init();
    }));
    it('Should enable feature 1', () => __awaiter(void 0, void 0, void 0, function* () {
        getMock.mockResolvedValueOnce(true);
        getMock.mockResolvedValueOnce(true);
        yield flipper_1.default.enable('feature1');
        const list = yield flipper_1.default.list();
        expect(list).toEqual({ feature1: true, feature2: true });
    }));
    it('Should disable feature 1', () => __awaiter(void 0, void 0, void 0, function* () {
        getMock.mockResolvedValueOnce(false);
        getMock.mockResolvedValueOnce(true);
        yield flipper_1.default.disable('feature1');
        const list = yield flipper_1.default.list();
        expect(list).toEqual({ feature1: false, feature2: true });
    }));
});
