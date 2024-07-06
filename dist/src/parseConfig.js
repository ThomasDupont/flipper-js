"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.getFileConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const options_type_1 = require("./@types/options.type");
const getFileConfig = () => options_type_1.featureConfigSchema.parse(JSON.parse(fs_1.default.readFileSync(path_1.default.resolve('features.json'), 'utf-8')));
exports.getFileConfig = getFileConfig;
exports.defaultConfig = {
    features: {},
    storage: {
        type: options_type_1.Adapter.Local
    }
};
