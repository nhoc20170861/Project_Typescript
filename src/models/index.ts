import mongoose from 'mongoose';


import roleModel from './role.model';
import userModel from './user.model';
import RefreshToken from './refreshToken.model';

const db = {
    mongoose,
    user: userModel,
    role: roleModel,
    refreshToken: RefreshToken,
    ROLES: ['user', 'admin', 'moderator']
};

db.mongoose = mongoose;

export default db;
