import mongoose from 'mongoose';

const { Schema } = mongoose;

export const customFieldSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    public: {
        type: Boolean,
        required: true,
    },
    lines: Number,
    options: [String],
});

// export default model('CustomField', customFieldSchema);
