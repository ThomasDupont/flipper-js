"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const auth_1 = require("./auth");
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
const zod_1 = require("zod");
const secret = 'secret';
describe('Test auth middleware', () => {
    const response = node_mocks_http_1.default.createResponse();
    it('Should hydrate request with parsed token', () => {
        const request = node_mocks_http_1.default.createRequest({
            headers: {
                authorization: `Bearer ${jsonwebtoken_1.default.sign({ login: 'test' }, secret)}`
            }
        });
        const next = jest.fn();
        (0, auth_1.auth)(secret)(request, response, next);
        expect(request.parsedToken).toEqual({ login: 'test' });
        expect(next).toHaveBeenCalled();
    });
    it('Should call next function with a JsonWebTokenError (invalid signature)', () => {
        const request = node_mocks_http_1.default.createRequest({
            headers: {
                authorization: `Bearer ${jsonwebtoken_1.default.sign({ login: 'test' }, 'wrong')}`
            }
        });
        const next = jest.fn();
        (0, auth_1.auth)(secret)(request, response, next);
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(jsonwebtoken_1.JsonWebTokenError);
        expect(next.mock.calls[0][0].message).toBe('invalid signature');
    });
    it('Should call next function with an error (Wrong token provided)', () => {
        const request = node_mocks_http_1.default.createRequest({
            headers: {
                authorization: 'something'
            }
        });
        const next = jest.fn();
        (0, auth_1.auth)(secret)(request, response, next);
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
        expect(next.mock.calls[0][0].message).toBe('Wrong token provided');
    });
    it('Should call next function with an error (ZodError)', () => {
        const request = node_mocks_http_1.default.createRequest({
            headers: {
                authorization: `Bearer ${jsonwebtoken_1.default.sign({ foo: 'bar' }, secret)}`
            }
        });
        const next = jest.fn();
        (0, auth_1.auth)(secret)(request, response, next);
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(zod_1.ZodError);
    });
});
