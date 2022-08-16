import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ratingSchema = new Schema(
    {
        quietness: {
            type: Number,
            required: true,
        },
        flatness: {
            type: Number,
            required: true,
        },
        clarity: {
            type: Number,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        notes: { type: String, default: '' },
        release: {
            type: Schema.Types.ObjectId,
            ref: 'Release',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);
export default model('Rating', ratingSchema);
