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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const models_1 = __importDefault(require("../models"));
const config_2 = require("../config/config");
const mongoose_1 = __importDefault(require("mongoose"));
const User = models_1.default.user;
const Role = models_1.default.role;
const RefreshToken = models_1.default.refreshToken;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
class AuthController {
}
_a = AuthController;
AuthController.signup = (req, res) => {
    const user = new User({
        _id: new mongoose_1.default.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (req.body.roles) {
            Role.find({
                name: { $in: req.body.roles }
            }, (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles = roles.map((role) => role._id);
                user.save((err) => {
                    // console.log(user);
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ message: 'User was registered successfully!' });
                });
            });
        }
        else {
            Role.findOne({ name: 'user' }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles = [role._id];
                user.save((err) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ message: 'User was registered successfully!' });
                });
            });
        }
    });
};
AuthController.signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    User.findOne({
        username: req.body.username
    })
        .populate('roles', 'name -_id')
        .exec((err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
        }
        console.log('🚀 user:', user);
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid Password!'
            });
        }
        const accessToken = jwt.sign({ userId: user.id }, config_1.accessTokenSecret, {
            expiresIn: config_2.jwtExpiration // 1 hours
        });
        // set refreshToken
        const refreshToken = yield RefreshToken.createToken(user.id);
        var authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
            const roleName = user.roles[i].name;
            authorities.push('ROLE_' + roleName.toUpperCase());
        }
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }));
});
AuthController.changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Get ID from JWT
    const { id } = req['token'];
    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
        return res.status(400).send();
    }
    //Get user from the database
    User.findById(id)
        .exec()
        .then((user) => {
        console.log(user);
        // Check if old password matchs
        if (user != null) {
            //  console.log(user.password);
            const checkOldPassword = bcrypt.compareSync(oldPassword, user.password);
            if (!checkOldPassword) {
                return res.send('oldpassword error');
            }
            user = Object.assign(user, { password: bcrypt.hashSync(newPassword, 8) });
            user.save().then((updateUser) => {
                res.json({
                    msg: 'update success',
                    updateUser
                });
            });
        }
    })
        .catch((err) => {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
});
AuthController.refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
        return res.status(403).json({ message: 'Refresh Token is required!' });
    }
    try {
        let refreshToken = yield RefreshToken.findOne({ token: requestToken });
        if (!refreshToken) {
            res.status(403).json({ message: 'Refresh token is not in database!' });
            return;
        }
        if (RefreshToken.verifyExpiration(refreshToken)) {
            yield RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
            res.status(403).json({
                message: 'Refresh token was expired. Please make a new signin request'
            });
            return;
        }
        let newAccessToken = jwt.sign({ id: refreshToken._id }, config_1.accessTokenSecret, {
            expiresIn: config_2.jwtExpiration
        });
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token
        });
    }
    catch (err) {
        return res.status(500).send({ message: err });
    }
});
exports.default = AuthController;
