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
exports.LocalAdapter = void 0;
const fs_1 = __importDefault(require("fs"));
const parseConfig_1 = require("../parseConfig");
class LocalAdapter {
    constructor() {
        this.config = parseConfig_1.defaultConfig;
        this.path = 'features.json';
        this.initConfig = (path, config) => __awaiter(this, void 0, void 0, function* () {
            this.path = path;
            this.config = config;
            return yield Promise.resolve(config);
        });
    }
    save(config) {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.default.writeFileSync(this.path, JSON.stringify(config, null, 2));
            this.config = config;
            return yield Promise.resolve(config);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const feature = this.config.features[key];
            return yield Promise.resolve(feature !== null && feature !== void 0 ? feature : false);
        });
    }
}
exports.LocalAdapter = LocalAdapter;
