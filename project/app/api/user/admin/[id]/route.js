import connectDB from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function DELETE(request, { params }) {
    try {

        const { id } = await params;
        console.log(id);

        if (!id) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Connect to the database

        // Find the user to confirm they exist and get their role
        const user = await User.findOne({ _id: id });
        console.log(user);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Delete the user
        const result = await User.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Failed to delete user' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: `Successfully deleted ${user.role}: ${user.name || user.email}`,
            deletedUser: {
                id: user._id,
                role: user.role,
                email: user.email,
                name: user.name
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}