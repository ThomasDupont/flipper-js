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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-extraneous-class */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User {
    static addUser(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcryptjs_1.default.genSalt(10);
            const secPass = yield bcryptjs_1.default.hash(password, salt);
            User.users.push({ login, password: secPass });
        });
    }
    static checkPassword(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = User.users.find((user) => user.login === login);
            if (user == null) {
                return false;
            }
            const passwordCompare = yield bcryptjs_1.default.compare(password, user.password);
            return passwordCompare;
        });
    }
    static deleteUsers() {
        User.users.splice(0, User.users.length);
    }
}
exports.User = User;
User.users = [];
