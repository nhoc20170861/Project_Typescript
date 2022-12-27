import { Request, Response, NextFunction } from 'express';
import { accessTokenSecret } from '../config/config';
import Logging from '../library/Logging';
import * as jwt from 'jsonwebtoken';
export interface CustomRequest extends Request {
    token: string | jwt.JwtPayload;
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = <string>req.headers['x-access-token'];
        // Logging.info(token);

        if (!token) {
            return res.status(403).send({ message: 'No token provided!' });
        }

        const decoded = jwt.verify(token, accessTokenSecret);

        (req as CustomRequest).token = decoded;
        // console.log(req['token']);

        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
};
