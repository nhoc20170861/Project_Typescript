import {Document, Schema, model} from 'mongoose';
export interface IRole extends Document{
    name: string;
}
const roleSchema =   new Schema<IRole>({
    name: {
        type: String,
        require: true,
        // unique: true
    }
})
const roleModel = model<IRole>('Role', roleSchema);
roleModel.findOne({name: 'user'}).then((role)=>{
    if(!role ) {
        roleModel.create({name:'user'});
        console.log("added 'user' to roles collection");
    }
})
roleModel.findOne({name: 'admin'}).then((role)=>{
    if(!role ) {
        roleModel.create({name:'admin'});
        console.log("added 'admin' to roles collection");
    }
})
roleModel.findOne({name: 'moderator'}).then((role)=>{
    if(!role ) {
        roleModel.create({name:'moderator'});
        console.log("added 'moderator' to roles collection");
    }
})

export default roleModel;
