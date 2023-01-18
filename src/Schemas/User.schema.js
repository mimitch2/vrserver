import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        discogsUserInfoUri: {
            type: String,
            unique: true,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
        },
        discogsUserId: {
            type: Number,
            unique: true,
            required: true,
        },
        discogsReleasesRated: {
            type: Number,
        },
        releasesRated: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.virtual('vinylRatings', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'user',
});

userSchema.virtual('userCopies', {
    ref: 'UserCopy',
    localField: '_id',
    foreignField: 'user',
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

export default model('User', userSchema);
