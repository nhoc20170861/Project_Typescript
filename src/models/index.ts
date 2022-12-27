import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

import Role from './role.model';
import User from './user.model';

const db = {
    mongoose,
    user: User,
    role: Role,
    ROLES: ['user', 'admin', 'moderator']
};

db.mongoose = mongoose;

export default db;
