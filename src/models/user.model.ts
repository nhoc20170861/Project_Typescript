import mongoose, { Schema, model, connect } from 'mongoose';
// 1. Create an interface representing a document in MongoDB.
export interface IUser {
    username: String;
    email: String;
    password: String;
    roles: [Schema.Types.ObjectId];
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Role'
    }
});

// 3. Create a Model.
const User = model<IUser>('User', userSchema);
const build = (att: IUser) => {
    return new User(att);
};

// const User = mongoose.model(
//   "User",
//   new mongoose.Schema({
//     username: String,
//     email: String,
//     password: String,
//     roles: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Role"
//       }
//     ]
//   })
// );
export default User;
