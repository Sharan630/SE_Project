// app/api/admin/mentorship/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/database/connectdb';
import User from '@/models/user';

export async function GET(request) {
    try {
        // Authenticate the admin
        await connectDB();

        // Fetch mentors and mentees from the database
        const mentors = await User.find({ role: 'mentor' })
        const mentees = await User.find({ role: 'mentee' })

        // Return the results
        return NextResponse.json(
            { mentor: mentors, mentee: mentees },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching mentorship data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mentorship data' },
            { status: 500 }
        );
    }
}

// DELETE request handler to remove a mentor or mentee by 