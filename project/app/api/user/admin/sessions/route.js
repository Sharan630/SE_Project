// app/api/admin/mentorship/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/database/connectdb';
import Subscription from '@/models/subscription';

export async function GET(request) {
    try {
        // Authenticate the admin
        await connectDB();

        // Fetch mentors and mentees from the database
        const data = await Subscription.find();
        // console.log(data);

        // Return the results
        return NextResponse.json(
            data,
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching sessions data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mentorship data' },
            { status: 500 }
        );
    }
}