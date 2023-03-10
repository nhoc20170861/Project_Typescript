import { Request, Response, NextFunction } from 'express';
import Logging from '../library/Logging';
import * as jwt from 'jsonwebtoken';

const { TokenExpiredError } = jwt;

import { accessTokenSecret } from '../config/config';
import db from '../models';
import { IRole } from '../models/role.model';
const User = db.user;
const Role = db.role;

export interface CustomRequest extends Request {
    token: string | jwt.JwtPayload;
}
export const catchError = (err: Error, res: Response) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: 'Unauthorized! Access Token was expired!' });
    }

    return res.sendStatus(401).send({ message: 'Unauthorized!' });
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = <string>req.headers['authorization'];
    const token = <string>authorizationHeader.split(' ')[1];
    Logging.info(token);

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    jwt.verify(token, <jwt.Algorithm>accessTokenSecret, (err, decoded) => {
        if (err) {
            return catchError(err, res);
        }
        (req as CustomRequest).token = <string>decoded;
        next();
    });

    console.log(req['token']);
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    User.findById(req['token'].userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user != null)
            Role.find(
                {
                    _id: { $in: user.roles }
                },
                (err: Error, roles: IRole[]) => {
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
                }
            );
    });
};

const isModerator = (req: Request, res: Response, next: NextFunction) => {
    User.findById(req['token'].userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user != null)
            Role.find(
                {
                    _id: { $in: user.roles }
                },
                (err :Error, roles: IRole[]) => {
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
                }
            );
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};
export default authJwt;
