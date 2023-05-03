import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// const NotesSchema = new Schema({
//     field_id: Number,
//     value: String,
// });

const userCopySchema = new Schema(
    {
        releaseId: {
            type: Number,
            required: true,
        },
        instanceId: {
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
        // notes: {
        //     type: [NotesSchema],
        //     default: null,
        // },
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
