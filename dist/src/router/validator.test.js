"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
const flipper_type_1 = require("../@types/flipper.type");
describe('Test validator middleware', () => {
    it('Should call next function and hydrate parsedBody object', () => {
        const request = node_mocks_http_1.default.createRequest({
            body: {
                login: 'test',
                password: 'test'
            }
        });
        const response = node_mocks_http_1.default.createResponse();
        const next = jest.fn();
        (0, validator_1.validate)({
            postSchema: flipper_type_1.loginPostArgSchema
        })(request, response, next);
        expect(request.parsedBody).toEqual({
            login: 'test',
            password: 'test'
        });
        expect(next).toHaveBeenCalled();
    });
    it('Should send error response with Parsing error', () => {
        const request = node_mocks_http_1.default.createRequest({
            body: {
                login: 'test'
            }
        });
        const response = node_mocks_http_1.default.createResponse();
        const next = jest.fn();
        (0, validator_1.validate)({
            postSchema: flipper_type_1.loginPostArgSchema
        })(request, response, next);
        const error = JSON.parse(response._getJSONData().error);
        expect(error[0].code).toBe('invalid_type');
        expect(error[0].path[0]).toBe('password');
    });
});
