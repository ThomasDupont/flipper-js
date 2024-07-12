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
    static init(configPath) {
        _a.config = (0, parseConfig_1.getFileConfig)(configPath !== null && configPath !== void 0 ? configPath : null);
        this.persistAdapter = new AdapterFactory_1.AdapterFactory(_a.config.storage.type);
    }
    static setPersistAdapter(adapter) {
        _a.persistAdapter = adapter;
    }
    static enable(feature) {
        return __awaiter(this, void 0, void 0, function* () {
            _a.config = yield _a.persistAdapter.save(Object.assign(Object.assign({}, _a.config), { features: Object.assign(Object.assign({}, _a.config.features), { [feature]: true }) }));
        });
    }
    static disable(feature) {
        return __awaiter(this, void 0, void 0, function* () {
            _a.config = yield _a.persistAdapter.save(Object.assign(Object.assign({}, _a.config), { features: Object.assign(Object.assign({}, _a.config.features), { [feature]: false }) }));
        });
    }
}
_a = Flipper;
Flipper.config = parseConfig_1.defaultConfig;
Flipper.persistAdapter = new AdapterFactory_1.AdapterFactory('local');
Flipper.getConfig = () => _a.config;
Flipper.list = () => __awaiter(void 0, void 0, void 0, function* () {
    const featureObject = yield Promise.all(Object.keys(_a.config.features).map((feature) => __awaiter(void 0, void 0, void 0, function* () { return [feature, yield _a.isEnabled(feature)]; })));
    return Object.fromEntries(featureObject);
});
Flipper.isEnabled = (feature) => __awaiter(void 0, void 0, void 0, function* () { return yield _a.persistAdapter.get(feature); });
exports.default = Flipper;
