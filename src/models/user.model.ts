import { Schema, model } from 'mongoose';
import testDb from '../database/init.multi.mongodb';
import { IRole } from './role.model';
// 1. Create an interface representing a document in MongoDB.
export interface IUser {
    username: String;
    email: String;
    password: String;
    roles: IRole['_id'][];
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
});

// 3. Create a Model.
const userModel = testDb.model<IUser>('User', userSchema);

export default userModel;
