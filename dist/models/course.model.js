"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const init_multi_mongodb_1 = __importDefault(require("../database/init.multi.mongodb"));
const courseSchema = new mongoose_1.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});
const Course = init_multi_mongodb_1.default.model('Course', courseSchema);
exports.default = Course;
