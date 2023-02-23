"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_model_1 = __importDefault(require("./role.model"));
const user_model_1 = __importDefault(require("./user.model"));
const refreshToken_model_1 = __importDefault(require("./refreshToken.model"));
const db = {
    user: user_model_1.default,
    role: role_model_1.default,
    refreshToken: refreshToken_model_1.default,
    ROLES: ['user', 'admin', 'moderator'],
};
exports.default = db;
