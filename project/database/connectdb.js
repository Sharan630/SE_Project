import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://apurav0711:kXLSO7w71BaWda0d@cluster0.loz7f.mongodb.net/?retryWrites=true&w=majority&appName=cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Couldn't connect to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;