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
        ratingAvg: {
            type: FloatType,
            required: true,
            default: 0
        },
        quietnessAvg: {
            type: FloatType,
            required: true,
            default: 0
        },
        flatnessAvg: {
            type: FloatType,
            required: true,
            default: 0
        },
        clarityAvg: {
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
