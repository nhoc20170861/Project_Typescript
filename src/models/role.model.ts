import { Document, model, Schema } from 'mongoose';

interface IRole extends Document {
    name: string;
}
const roleSchema = new Schema<IRole>({
    name: {
        type: String,
        required: true
    }
});

const Role = model<IRole>('Role', roleSchema);

// Role.create([{ name: 'user' }, { name: 'admin' }, { name: 'moderator' }])
//     .then(() => console.log('Add role success!'))
//     .catch((err) => console.log(`Add fail: ${err}`));
export default Role;
