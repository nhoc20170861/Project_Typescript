"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const init_multi_mongodb_1 = __importDefault(require("../database/init.multi.mongodb"));
// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
});
// 3. Create a Model.
const userModel = init_multi_mongodb_1.default.model('User', userSchema);
exports.default = userModel;
