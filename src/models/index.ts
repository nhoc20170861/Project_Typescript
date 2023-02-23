
import roleModel from './role.model';
import userModel from './user.model';
import RefreshToken from './refreshToken.model';

const db = {
    user: userModel,
    role: roleModel,
    refreshToken: RefreshToken,
    ROLES: ['user', 'admin', 'moderator'],

};

export default db;

