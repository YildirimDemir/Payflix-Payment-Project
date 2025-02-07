import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/authBcrypt';
import { connectToDB } from '@/lib/mongodb';
import Account from '@/models/accountModel';
import { generateAccountNumber } from '@/lib/generateAccountNumber';

export const POST = async (req: NextRequest) => {
    try {
        const { name, email, password, passwordConfirm } = await req.json();

        if (!name || !email || !email.includes("@") || !password || password.trim().length < 7) {
            return NextResponse.json({ message: "Invalid input." }, { status: 422 });
        }

        await connectToDB();

        const existingUser = await Account.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User exists already!" }, { status: 422 });
        }

        if (password !== passwordConfirm) {
            return NextResponse.json({ message: "Passwords are not the same!" }, { status: 422 });
        }

        let accountNumber = generateAccountNumber();
        let isUnique = false;

        while (!isUnique) {
            const existingAccount = await Account.findOne({ accountNumber });
            if (!existingAccount) {
                isUnique = true;
            } else {
                accountNumber = generateAccountNumber();
            }
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new Account({
            name,
            email,
            password: hashedPassword,
            accountNumber,
        });

        await newUser.save();

        return NextResponse.json({ message: "User Created", accountNumber }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating user:', error.message);
            return NextResponse.json({ message: 'Failed to create user', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ message: 'Failed to create user', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
};
