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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterFactory = void 0;
const local_adapter_1 = require("./local.adapter");
const redis_adapter_1 = require("./redis.adapter");
class AdapterFactory {
    constructor(storageType) {
        this.getAdapter = () => this.adapter;
        this.save = (config) => __awaiter(this, void 0, void 0, function* () { return yield this.adapter.save(config); });
        this.get = (key) => __awaiter(this, void 0, void 0, function* () { return yield this.adapter.get(key); });
        switch (storageType) {
            case 'local':
                this.adapter = new local_adapter_1.LocalAdapter();
                break;
            case 'redis':
                this.adapter = new redis_adapter_1.RedisAdapter();
                break;
            default:
                throw new Error('Invalid storage type');
        }
    }
}
exports.AdapterFactory = AdapterFactory;
