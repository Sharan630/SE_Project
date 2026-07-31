import { writeFile } from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const data = await req.formData();
        // console.log(data)
        const file = data.get("image");
        // console.log(file)// Ensure "image" is the form field name

        if (!file) {
            return NextResponse.json({ message: "No file uploaded", success: false });
        }

        if (!file.name || !file.name.includes(".")) {
            return NextResponse.json({ message: "Invalid file name", success: false });
        }

        const timestamp = Date.now();
        const extension = file.name.split('.').pop()
        const filename = `IMG${timestamp}.${extension}`;

        const uploadDir = path.join(process.cwd(), "public/user");

        await writeFile(uploadDir, "", { flag: "a" });

        const filePath = path.join(uploadDir, filename);

        const stream = createWriteStream(filePath);
        stream.write(Buffer.from(await file.arrayBuffer()));

        return NextResponse.json({ message: "Upload successful", success: true, path: `/user/${filename}` });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ message: "Upload failed", success: false, error: error.message });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
