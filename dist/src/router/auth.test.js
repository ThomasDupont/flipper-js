"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./auth");
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
const secret = 'secret';
describe('Test auth middleware', () => {
    it('Should hydrate request with parsed token', () => {
        const request = node_mocks_http_1.default.createRequest({
            headers: {
                authorization: `Bearer ${jsonwebtoken_1.default.sign({ login: 'test' }, secret)}`
            }
        });
        const response = node_mocks_http_1.default.createResponse();
        const next = jest.fn();
        (0, auth_1.auth)(secret)(request, response, next);
        expect(request.parsedToken).toEqual({ login: 'test' });
        expect(next).toHaveBeenCalled();
    });
    it('Should call send response with a JsonWebTokenError (invalid signature)', () => {
        const request = node_mocks_http_1.default.createRequest({
            headers: {
                authorization: `Bearer ${jsonwebtoken_1.default.sign({ login: 'test' }, 'wrong')}`
            }
        });
        const response = node_mocks_http_1.default.createResponse();
        const next = jest.fn();
        (0, auth_1.auth)(secret)(request, response, next);
        expect(response._getJSONData().error).toBe('invalid signature');
    });
    it('Should call send response with an error (Wrong token provided)', () => {
        const request = node_mocks_http_1.default.createRequest({
            headers: {
                authorization: 'something'
            }
        });
        const response = node_mocks_http_1.default.createResponse();
        const next = jest.fn();
        (0, auth_1.auth)(secret)(request, response, next);
        expect(response._getJSONData().error).toBe('Wrong token provided');
    });
    it('Should call send response with an error (ZodError)', () => {
        const request = node_mocks_http_1.default.createRequest({
            headers: {
                authorization: `Bearer ${jsonwebtoken_1.default.sign({ foo: 'bar' }, secret)}`
            }
        });
        const response = node_mocks_http_1.default.createResponse();
        const next = jest.fn();
        (0, auth_1.auth)(secret)(request, response, next);
        const error = JSON.parse(response._getJSONData().error);
        expect(error[0].code).toBe('invalid_type');
    });
});
