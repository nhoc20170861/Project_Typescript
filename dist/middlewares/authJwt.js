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
exports.catchError = void 0;
const Logging_1 = __importDefault(require("../library/Logging"));
const jwt = __importStar(require("jsonwebtoken"));
const { TokenExpiredError } = jwt;
const config_1 = require("../config/config");
const models_1 = __importDefault(require("../models"));
const User = models_1.default.user;
const Role = models_1.default.role;
const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: 'Unauthorized! Access Token was expired!' });
    }
    return res.sendStatus(401).send({ message: 'Unauthorized!' });
};
exports.catchError = catchError;
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    Logging_1.default.info(token);
    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }
    jwt.verify(token, config_1.accessTokenSecret, (err, decoded) => {
        if (err) {
            return (0, exports.catchError)(err, res);
        }
        req.token = decoded;
        next();
    });
    console.log(req['token']);
});
const isAdmin = (req, res, next) => {
    User.findById(req['token'].userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user != null)
            Role.find({
                _id: { $in: user.roles }
            }, (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'admin') {
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: 'Require Admin Role!' });
                return;
            });
    });
};
const isModerator = (req, res, next) => {
    User.findById(req['token'].userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user != null)
            Role.find({
                _id: { $in: user.roles }
            }, (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'moderator') {
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: 'Require Moderator Role!' });
                return;
            });
    });
};
const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};
exports.default = authJwt;
