import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const customFieldSchema = new Schema({
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
    lines: {
        type: Number,
        required: true,
    },
});

export default model('CustomField', customFieldSchema);
