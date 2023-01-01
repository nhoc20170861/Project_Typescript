import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

import Role from './role.model';
import User from './user.model';
import RefreshToken from './refreshToken.model';

const db = {
    mongoose,
    user: User,
    role: Role,
    refreshToken: RefreshToken,
    ROLES: ['user', 'admin', 'moderator']
};

db.mongoose = mongoose;

export default db;
