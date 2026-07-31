import { NextResponse } from 'next/server';
import connectDB from '@/database/connectdb';
import BlockedUser from '@/models/blockeduser';

export async function GET(request) {
    try {
        // Authenticate the admin
        await connectDB();

        // Fetch mentors and mentees from the database
        const data = await BlockedUser.find()
        // console.log(data);

        // Return the results
        return NextResponse.json(
            data,
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching sessions data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blockedusers data' },
            { status: 500 }
        );
    }
}