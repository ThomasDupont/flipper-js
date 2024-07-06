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
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
describe('User class', () => {
    beforeEach(() => {
        user_1.User.deleteUsers();
    });
    it('should return true for correct password', () => __awaiter(void 0, void 0, void 0, function* () {
        const login = 'testUser';
        const password = 'testPassword';
        yield user_1.User.addUser(login, password);
        const result = yield user_1.User.checkPassword(login, password);
        expect(result).toBe(true);
    }));
    it('should return false for incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const login = 'testUser';
        const password = 'testPassword';
        const wrongPassword = 'wrongPassword';
        yield user_1.User.addUser(login, password);
        const result = yield user_1.User.checkPassword(login, wrongPassword);
        expect(result).toBe(false);
    }));
    it('should return false for non-existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        const login = 'nonExistingUser';
        const password = 'testPassword';
        const result = yield user_1.User.checkPassword(login, password);
        expect(result).toBe(false);
    }));
});
