import mongoose from 'mongoose';



const courseSchema = new mongoose.Schema({
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
const Course = mongoose.model('Course', courseSchema);
export default Course;
