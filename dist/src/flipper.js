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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const parseConfig_1 = require("./parseConfig");
const AdapterFactory_1 = require("./persist/AdapterFactory");
class Flipper {
}
_a = Flipper;
Flipper.config = parseConfig_1.defaultConfig;
Flipper.persistAdapter = new AdapterFactory_1.AdapterFactory('local');
Flipper.init = (configPath) => __awaiter(void 0, void 0, void 0, function* () {
    const config = (0, parseConfig_1.getFileConfig)(configPath !== null && configPath !== void 0 ? configPath : null);
    _a.persistAdapter = new AdapterFactory_1.AdapterFactory(_a.config.storage.type);
    _a.config = yield _a.persistAdapter.initConfig(configPath !== null && configPath !== void 0 ? configPath : 'features.json', config);
});
Flipper.getConfig = () => _a.config;
Flipper.setPersistAdapter = (adapter) => {
    _a.persistAdapter = adapter;
};
Flipper.list = () => __awaiter(void 0, void 0, void 0, function* () {
    const featureObject = yield Promise.all(Object.keys(_a.config.features).map((feature) => __awaiter(void 0, void 0, void 0, function* () { return [feature, yield _a.isEnabled(feature)]; })));
    return Object.fromEntries(featureObject);
});
Flipper.isEnabled = (feature) => __awaiter(void 0, void 0, void 0, function* () { return yield _a.persistAdapter.get(feature); });
Flipper.enable = (feature) => __awaiter(void 0, void 0, void 0, function* () {
    _a.config = yield _a.persistAdapter.save(Object.assign(Object.assign({}, _a.config), { features: Object.assign(Object.assign({}, _a.config.features), { [feature]: true }) }));
});
Flipper.disable = (feature) => __awaiter(void 0, void 0, void 0, function* () {
    _a.config = yield _a.persistAdapter.save(Object.assign(Object.assign({}, _a.config), { features: Object.assign(Object.assign({}, _a.config.features), { [feature]: false }) }));
});
exports.default = Flipper;
