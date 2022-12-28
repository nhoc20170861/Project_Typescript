import { accessTokenSecret } from '../config/config';
import { IUser } from '../models/user.model';
import db from '../models';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
const User = db.user;
const Role = db.role;

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
            return res.status(200).json({ message: 'User was registered successfully!' });

            // if (req.body.roles) {
            //     Role.find(
            //         {
            //             name: { $in: req.body.roles }
            //         },
            //         (err, roles) => {
            //             if (err) {
            //                 res.status(500).send({ message: err });
            //                 return;
            //             }

            //             user.roles = roles.map((role) => role._id);
            //             user.save((err) => {
            //                 if (err) {
            //                     res.status(500).send({ message: err });
            //                     return;
            //                 }

            //                 res.send({ message: 'User was registered successfully!' });
            //             });
            //         }
            //     );
            // } else {
            //     Role.findOne({ name: 'user' }, (err, role) => {
            //         if (err) {
            //             res.status(500).send({ message: err });
            //             return;
            //         }

            //         user.roles = [role._id];
            //         user.save((err) => {
            //             if (err) {
            //                 res.status(500).send({ message: err });
            //                 return;
            //             }

            //             res.send({ message: 'User was registered successfully!' });
            //         });
            //     });
            // }
        });
    };

    static signin = (req: Request, res: Response) => {
        console.log(req.body);
        User.findOne({
            username: req.body.username
        })
            //.populate('roles', '-__v')
            .exec((err, user) => {
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

                const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, {
                    expiresIn: 86400 // 24 hours
                });

                // set refreshToken
                const refreshToken = jwt.sign(
                    {
                        id: user.id
                    },
                    accessTokenSecret,
                    {
                        expiresIn: 3600 * 24 // //expire after 24h
                    }
                );

                var authorities: string[] = [];

                // for (let i = 0; i < user.roles.length; i++) {
                //     authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
                // }
                res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    // roles: authorities,
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
}

export default AuthController;
