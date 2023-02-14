import { Schema, model } from 'mongoose';
// 1. Create an interface representing a document in MongoDB.
export interface IUser {
    username: string;
    email: string;
    password: string;
    roles: [Schema.Types.ObjectId];
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
const User = model<IUser>('User', userSchema);

export default User;
