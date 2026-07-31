import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import connectDB from '@/database/connectdb';
import Message from '@/models/message';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req) {
    try {
        await connectDB();

        // Parse the FormData directly using the built-in method
        const formData = await req.formData();

        // Get form fields
        const file = formData.get('file');
        const roomId = formData.get('roomId');
        const senderId = formData.get('senderId');
        const receiverId = formData.get('receiverId');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Extract file information
        const fileName = file.name;
        const fileType = file.type;

        // Generate unique filename
        const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(fileName)}`;
        const filePath = path.join(uploadDir, uniqueFilename);

        // Convert file to Buffer and save it
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Create URL for the file
        const fileUrl = `/uploads/${uniqueFilename}`;

        console.log('File saved successfully:', filePath);

        // Return response matching what frontend expects
        return NextResponse.json({
            fileUrl,
            filename: fileName, // Note: frontend expects 'filename' not 'fileName'
            fileType
        }, { status: 200 });

    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ error: `Error uploading file: ${error.message}` }, { status: 500 });
    }
}