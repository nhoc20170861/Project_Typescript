import { Schema } from 'mongoose';
import testDb from '../database/init.multi.mongodb';
const courseSchema = new Schema({
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
const Course = testDb.model('Course', courseSchema);
export default Course;
