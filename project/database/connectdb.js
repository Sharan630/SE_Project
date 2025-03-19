import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/mentorcruise";

const connectdb = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to MongoDB successfully.");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

export default connectdb;
