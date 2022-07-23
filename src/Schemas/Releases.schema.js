import mongoose from 'mongoose';
import Float from 'mongoose-float';

const { Schema, model } = mongoose;
const FloatType = Float.loadType(mongoose);

const releaseSchema = new Schema(
    {
        releaseId: {
            type: Number,
            required: true
        },
        artist: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        ratingsCount: {
            type: Number,
            required: true,
            default: 0
        },
        avgRating: {
            type: FloatType,
            required: true
        },
        avgQuietness: {
            type: FloatType,
            required: true,
            default: 0
        },
        avgFlatness: {
            type: FloatType,
            required: true,
            default: 0
        },
        avgClarity: {
            type: FloatType,
            required: true,
            default: 0
        },
        washedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

releaseSchema.virtual('vinylRatings', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'release'
});

releaseSchema.virtual('currentUserRating', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'release'
});

releaseSchema.set('toObject', { virtuals: true });
releaseSchema.set('toJSON', { virtuals: true });

export default model('Release', releaseSchema);
