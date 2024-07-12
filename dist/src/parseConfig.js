"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileConfig = exports.defaultConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const options_type_1 = require("./@types/options.type");
exports.defaultConfig = {
    features: {},
    storage: {
        type: options_type_1.Adapter.Local
    }
};
let configPath = 'features.json';
const getFileConfig = (pathToConfig) => {
    if (pathToConfig != null) {
        configPath = pathToConfig;
    }
    return options_type_1.featureConfigSchema.parse(JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(configPath), 'utf-8')));
};
exports.getFileConfig = getFileConfig;
