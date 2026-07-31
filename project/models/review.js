import mongoose from "mongoose";


const ReviewSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, trim: true },
    done: {type: Boolean, require: true}

}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
