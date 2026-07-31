import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true,
        enum: [
            'harassment',
            'scam',
            'spam',
            'inappropriate_content',
            'unprofessional_behavior',
            'other'
        ]
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['submitted', 'under_review', 'resolved', 'dismissed'],
        default: 'submitted'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date,
        default: null
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

reportSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;