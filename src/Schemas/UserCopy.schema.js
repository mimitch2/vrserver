import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userCopySchema = new Schema(
    {
        instanceId: {
            type: Number,
            required: true,
        },
        washedOn: {
            type: String,
            default: '',
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
