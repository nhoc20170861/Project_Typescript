import Role from './role.model';
import User from './user.model';
import RefreshToken from './refreshToken.model';

const db = {
    user: User,
    role: Role,
    refreshToken: RefreshToken,
    ROLES: ['user', 'admin', 'moderator']
};

export default db;
