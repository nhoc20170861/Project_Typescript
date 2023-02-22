import { accessTokenSecret } from '../config/config';
import { IUser } from '../models/user.model';
import db from '../models';
import { Request, Response } from 'express';
import { jwtExpiration } from '../config/config';
import mongoose from 'mongoose';
import roleModel, { IRole } from '../models/role.model';

const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

class AuthController {
    static signup = (req: Request, res: Response) => {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        });

        user.save((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            // return res.status(200).json({ message: 'User was registered successfully!' });

            if (req.body.roles) {
                Role.find(
                    {
                        name: { $in: req.body.roles }
                    },
                    (err: Error, roles: IRole[]) => {
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
                    }
                );
            } else {
                Role.findOne({ name: 'user' }, (err: Error, role: IRole) => {
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

    static signin = async (req: Request, res: Response) => {
        console.log(req.body);
        User.findOne({
            username: req.body.username
        })
            //.populate('roles', '-__v')
            .exec(async (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (!user) {
                    return res.status(404).send({ message: 'User Not found.' });
                }

                var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: 'Invalid Password!'
                    });
                }

                const accessToken = jwt.sign({ userId: user.id }, accessTokenSecret, {
                    expiresIn: jwtExpiration // 1 hours
                });

                // set refreshToken
                const refreshToken = await RefreshToken.createToken(user.id);
                console.log('refreshtoken', refreshToken);

                var authorities: string[] = [];
               
                for (let i = 0; i < user.roles.length; i++) {
                    await roleModel.findById(user.roles[i]).then((role) => {
                        if (role != null) {
                            authorities.push('ROLE_' + role.name.toUpperCase());
                        }
                    });
                }
                res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });
            });
    };

    static changePassword = async (req: Request, res: Response) => {
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
    };

    static refreshToken = async (req: Request, res: Response) => {
        const { refreshToken: requestToken } = req.body;

        if (requestToken == null) {
            return res.status(403).json({ message: 'Refresh Token is required!' });
        }

        try {
            let refreshToken = await RefreshToken.findOne({ token: requestToken });

            if (!refreshToken) {
                res.status(403).json({ message: 'Refresh token is not in database!' });
                return;
            }

            if (RefreshToken.verifyExpiration(refreshToken)) {
                await RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();

                res.status(403).json({
                    message: 'Refresh token was expired. Please make a new signin request'
                });
                return;
            }
            let newAccessToken = jwt.sign({ id: refreshToken._id }, accessTokenSecret, {
                expiresIn: jwtExpiration
            });

            return res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: refreshToken.token
            });
        } catch (err) {
            return res.status(500).send({ message: err });
        }
    };
}

export default AuthController;
