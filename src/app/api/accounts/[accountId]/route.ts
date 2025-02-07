import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import Account, { IAccount } from '@/models/accountModel';

export const GET = async (req: NextRequest, { params }: { params: { accountId: string } }) => {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req, secret });

        if (!token) {
            return NextResponse.json({ message: "Authentication required" }, { status: 401 });
        }

        const { accountId } = params;

        if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
            return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
        }

        await connectToDB();
        const account: IAccount | null = await Account.findById(accountId).exec();

        if (!account) {
            return NextResponse.json({ message: "Account not found on ID..." }, { status: 404 });
        }

        return NextResponse.json(account, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Failed to fetch account', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
};