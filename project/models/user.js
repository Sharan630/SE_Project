import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["mentor", "mentee", "admin"], required: true },
    picture: { type: String, default: "" },
    bio: { type: String, trim: true },
    skills: { type: [String], default: [] },
    experience: { type: String, default: 0 },
    phone: { type: String, trim: true },
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    }],
    reportedCount: {
        type: Number,
        default: 0
    },
    availability: {
        type: [{ day: String, timeSlots: [String] }],
        default: []
    },
    fees: { type: String, trim: true },
    ratings: {
        average: { type: Number, default: 0 },
        reviews: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number, comment: String }]
    },
    connected: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            endDate: { type: Date }
        }
    ],
    linkedin: { type: String, trim: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
