"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtRefreshExpiration = exports.jwtExpiration = exports.refreshTokenSecret = exports.accessTokenSecret = exports.SERVER_PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
exports.SERVER_PORT = process.env.PORT_SERVER;
exports.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
exports.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
exports.jwtExpiration = 3600; // 1 hour
exports.jwtRefreshExpiration = 86400; // 24 hours
const mongodb = {
    HOST: process.env.MONGO_HOST,
    PORT: process.env.MONGO_PORT,
    DB: process.env.MONGO_DATABASE
};
exports.default = mongodb;
