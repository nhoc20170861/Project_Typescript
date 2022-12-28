import { NextFunction, Request, Response, Router } from 'express';
import verifySignUp from '../middlewares/verifySignup';
import { verifyToken } from '../middlewares/authJwt';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
});

router.post('/signup', [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], AuthController.signup);

router.post('/signin', AuthController.signin);

//Change my password
router.put('/change-password', [verifyToken], AuthController.changePassword);
export default router;
