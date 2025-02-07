import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt';
import Account, { IAccount } from '@/models/accountModel';

export const PATCH = async (req: NextRequest, { params }: { params: { accountId: string } }) => {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No token provided.' }, { status: 401 });
        }

        const { accountId } = params;
        if (token.id !== accountId) {
            return NextResponse.json({ message: 'Forbidden: You can only update your own account.' }, { status: 403 });
        }

        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ message: "Name, and email are required." }, { status: 400 });
        }

        await connectToDB();

        const updatedAccount: IAccount | null = await Account.findByIdAndUpdate(
            accountId,
            { name, email },
            { new: true, runValidators: true }
        );

        if (!updatedAccount) {
            return NextResponse.json({ message: "Account update failed." }, { status: 404 });
        }

        return NextResponse.json(updatedAccount, { status: 200 });
    } catch (error) {
        console.error('Error updating user info:', error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
};