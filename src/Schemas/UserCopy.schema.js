import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userCopySchema = new Schema(
    {
        releaseId: {
            type: Number,
            required: true,
        },
        washedOn: {
            type: String,
            default: '',
        },
        release: {
            type: Schema.Types.ObjectId,
            ref: 'Release',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Release',
            required: true,
        },
    },
    { timestamps: true }
);

// userCopySchema.virtual('release', {
//     ref: 'Release',
//     localField: '_id',
//     foreignField: 'userCopy'
// });

// userCopySchema.set('toObject', { virtuals: true });
// userCopySchema.set('toJSON', { virtuals: true });

export default model('UserCopy', userCopySchema);
