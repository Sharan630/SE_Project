// app/api/mentors/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/database/connectdb';
import User from '@/models/user';

export async function GET() {
  try {
    await connectDB();

    const mentors = await User.find({ role: 'mentor' });

    return NextResponse.json({ mentors }, { status: 200 });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json({ error: 'Failed to fetch mentors' }, { status: 500 });
  }
}
