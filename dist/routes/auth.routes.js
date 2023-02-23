"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifySignup_1 = __importDefault(require("../middlewares/verifySignup"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = (0, express_1.Router)();
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
});
router.post('/signup', [verifySignup_1.default.checkDuplicateUsernameOrEmail, verifySignup_1.default.checkRolesExisted], auth_controller_1.default.signup);
router.post('/signin', auth_controller_1.default.signin);
//Change my password
router.put('/change-password', [authJwt_1.default.verifyToken], auth_controller_1.default.changePassword);
router.post('/refreshtoken', auth_controller_1.default.refreshToken);
exports.default = router;
