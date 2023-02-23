"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const init_multi_mongodb_1 = __importDefault(require("../database/init.multi.mongodb"));
const roleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        require: true
        // unique: true
    }
});
const roleModel = init_multi_mongodb_1.default.model('Role', roleSchema);
roleModel.findOne({ name: 'user' }).then((role) => {
    if (!role) {
        roleModel.create({ name: 'user' });
        console.log("added 'user' to roles collection");
    }
});
roleModel.findOne({ name: 'admin' }).then((role) => {
    if (!role) {
        roleModel.create({ name: 'admin' });
        console.log("added 'admin' to roles collection");
    }
});
roleModel.findOne({ name: 'moderator' }).then((role) => {
    if (!role) {
        roleModel.create({ name: 'moderator' });
        console.log("added 'moderator' to roles collection");
    }
});
exports.default = roleModel;
