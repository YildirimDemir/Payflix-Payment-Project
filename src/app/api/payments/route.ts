import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Account from '@/models/accountModel';
import Payment from '@/models/paymentModel';

export const POST = async (req: NextRequest) => {
    try {
        const response = NextResponse.json(
            { message: 'Payment successful.' },
            { status: 200 }
        );
        
        response.headers.set('Access-Control-Allow-Origin', '*'); 
        response.headers.set('Access-Control-Allow-Methods', 'POST');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        const { senderAccountNumber, receiverAccountNumber, amount } = await req.json();

        if (!senderAccountNumber || !receiverAccountNumber || !amount || amount <= 0) {
            return NextResponse.json({ message: "Invalid input." }, { status: 422 });
        }

        await connectToDB();

        const senderAccount = await Account.findOne({ accountNumber: senderAccountNumber });
        if (!senderAccount) {
            return NextResponse.json({ message: "Sender account not found." }, { status: 404 });
        }

        const receiverAccount = await Account.findOne({ accountNumber: receiverAccountNumber });
        if (!receiverAccount) {
            return NextResponse.json({ message: "Receiver account not found." }, { status: 404 });
        }

        if (senderAccount.amount < amount) {
            return NextResponse.json({ message: "Insufficient funds." }, { status: 400 });
        }

        senderAccount.amount -= amount;
        await senderAccount.save();

        receiverAccount.amount += amount;
        await receiverAccount.save();

        const newPayment = new Payment({
            senderAccount: senderAccount._id,
            receiverAccount: receiverAccount._id,
            amount,
            description: `Payment from ${senderAccount.name} to ${receiverAccount.name}`,
        });

        await newPayment.save();

        return response; 
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error processing payment:', error.message);
            return NextResponse.json({ message: 'Failed to process payment', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ message: 'Failed to process payment', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
};
