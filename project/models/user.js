import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["mentor", "mentee"], required: true },
    picture: { type: String, default: "" },
    bio: { type: String, trim: true },
    skills: { type: [String], default: [] },
    experience: { type: Number, default: 0 },
    phone: { type: String, trim: true },
    availability: {
        type: [{ day: String, timeSlots: [String] }],
        default: []
    },
    ratings: {
        average: { type: Number, default: 0 },
        reviews: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number, comment: String }]
    },
    connected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
