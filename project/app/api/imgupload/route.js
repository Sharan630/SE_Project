import multer from "multer";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import { NextResponse } from "next/server";

// ⚙️ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to process the upload with multer
function runMiddleware(req, middleware) {
  return new Promise((resolve, reject) => {
    middleware(req, { end: resolve }, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
}

// Upload to Cloudinary function
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: "mentors-mentees" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    Readable.from(buffer).pipe(stream);
  });
}

// POST handler for the App Router
export async function POST(request) {
  try {
    // Convert NextRequest to NodeJS req object format for multer
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded!" },
        { status: 400 }
      );
    }

    // Process the file
    const buffer = Buffer.from(await file.arrayBuffer());
    
    try {
      const result = await uploadToCloudinary(buffer);
      
      return NextResponse.json({
        success: true,
        message: "Image uploaded successfully!",
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return NextResponse.json(
        { error: "Upload failed!" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json(
      { error: `Upload failed! ${error.message}` },
      { status: 500 }
    );
  }
}

// Config for the API route
export const config = {
  api: {
    bodyParser: false,
  },
};