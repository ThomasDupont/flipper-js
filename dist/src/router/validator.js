"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const effect_1 = require("effect");
const parseArgsEffect = (codec) => (undecoded) => (0, effect_1.pipe)(codec.safeParse(undecoded), parse => parse.success ? effect_1.Effect.succeed(parse.data) : effect_1.Effect.fail(parse.error));
const validate = ({ getSchema, postSchema }) => (req, res, next) => {
    (0, effect_1.pipe)(effect_1.Effect.all([
        getSchema != null ? parseArgsEffect(getSchema)(req.query) : effect_1.Effect.succeed(null),
        postSchema != null ? parseArgsEffect(postSchema)(req.body) : effect_1.Effect.succeed(null)
    ]), effect_1.Effect.map(([getArgs, postArgs]) => {
        if (getArgs !== null) {
            req.parsedQuery = getArgs;
        }
        if (postArgs !== null) {
            req.parsedBody = postArgs;
        }
        next();
        return effect_1.Effect.void;
    }), effect_1.Effect.catchAll(error => {
        res.json({ error: error.message });
        return effect_1.Effect.void;
    }), effect_1.Effect.runSync);
};
exports.validate = validate;
