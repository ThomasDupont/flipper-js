"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureSchema = exports.featureConfigSchema = exports.Adapter = void 0;
const zod_1 = require("zod");
var Adapter;
(function (Adapter) {
    Adapter["Local"] = "local";
    Adapter["Redis"] = "redis";
})(Adapter || (exports.Adapter = Adapter = {}));
exports.featureConfigSchema = zod_1.z.object({
    features: zod_1.z.record(zod_1.z.boolean()),
    storage: zod_1.z.object({
        type: zod_1.z.nativeEnum(Adapter)
    })
});
exports.featureSchema = zod_1.z.string().min(1, 'Feature name cannot be empty');
