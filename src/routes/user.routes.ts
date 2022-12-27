import { Router, Request, Response, NextFunction } from 'express';
import { allAccess, userBoard } from '../controllers/user.controller';

import { verifyToken } from '../middlewares/authJwt';
const router = Router();
router.get('/home', (req: Request, res: Response) => {
    return res.json({ message: 'Welcome to bezkoder application.' });
});

router.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
});

router.get('/all', allAccess);

router.get('/user', [verifyToken], userBoard);

export default router;
