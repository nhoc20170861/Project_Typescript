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
const mongoose_1 = require("mongoose");
const init_multi_mongodb_1 = __importDefault(require("../database/init.multi.mongodb"));
const config_1 = require("../config/config");
const uuid_1 = require("uuid");
const refreshTokenSchema = new mongoose_1.Schema({
    token: { type: String, required: true },
    expiryDate: { type: Date },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
});
refreshTokenSchema.static('createToken', function createToken(_userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('creteRefreshToken');
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + config_1.jwtRefreshExpiration);
        let _token = (0, uuid_1.v4)();
        // console.log(_token);
        // console.log(expiredAt.getTime());
        // console.log(_userId);
        let _object = new this({
            token: _token,
            userId: _userId,
            expiryDate: expiredAt.getTime()
        });
        let refreshToken = yield _object.save();
        console.log('refresh', refreshToken);
        return refreshToken.token;
    });
});
refreshTokenSchema.static('verifyExpiration', function verifyExpiration(token) {
    return token.expiryDate.getTime() < new Date().getTime();
});
const refreshToken = init_multi_mongodb_1.default.model('RefreshToken', refreshTokenSchema);
exports.default = refreshToken;
