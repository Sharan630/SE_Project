import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Use pipeline for proper stream handling
const pipeline = promisify(require('stream').pipeline);

// Disable body parsing since we're handling multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }

  try {
    const data = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

    // Parse multipart form data
    const boundary = req.headers['content-type'].split('=')[1];
    const parts = data.toString().split(`--${boundary}`);

    let fileData;
    let email;

    parts.forEach((part) => {
      if (part.includes('name="profileImage"')) {
        const match = part.match(/filename="([^"]+)"/);
        if (match) {
          const filename = match[1];
          const fileContent = part.split('\r\n\r\n')[1].trim();
          fileData = { filename, content: fileContent };
        }
      } else if (part.includes('name="email"')) {
        email = part.split('\r\n\r\n')[1].trim();
      }
    });

    if (!fileData) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Generate unique filename
    const ext = path.extname(fileData.filename);
    const newFilename = `${uuidv4()}${ext}`;
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', newFilename);

    // Save file
    await pipeline(
      fileData.content,
      createWriteStream(uploadPath)
    );

    return res.status(200).json({
      success: true,
      imageUrl: `/uploads/${newFilename}`,
      message: 'File uploaded successfully',
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'File upload failed',
    });
  }
}