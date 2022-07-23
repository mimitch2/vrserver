import mongoose from 'mongoose';

// const Float = require('mongoose-float').loadType(mongoose);

const releaseSchema = new mongoose.Schema(
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
        overallRatingAverage: {
            type: Number,
            required: true
        },
        overallRatingTotal: {
            type: Number,
            required: true,
            default: 0
        },
        flatnessAverage: {
            type: Number,
            required: true,
            default: 0
        },
        flatnessTotal: {
            type: Number,
            required: true,
            default: 0
        },
        quietnessAverage: {
            type: Number,
            required: true,
            default: 0
        },
        quietnessTotal: {
            type: Number,
            required: true,
            default: 0
        },
        physicalConditionAverage: {
            type: Number,
            required: true,
            default: 0
        },
        physicalConditionTotal: {
            type: Number,
            required: true,
            default: 0
        },
        washedAt: {
            type: String,
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

export default mongoose.model('Release', releaseSchema);
