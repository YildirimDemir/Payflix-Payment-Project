import { NextRequest, NextResponse } from 'next/server';
import Account from '@/models/accountModel';
import { connectToDB } from '@/lib/mongodb';

export async function PATCH(req: NextRequest, { params }: { params: { accountId: string } }) {
  try {
    const { accountId } = params;
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid deposit amount.' }, { status: 400 });
    }

    await connectToDB();
    const account = await Account.findById(accountId);

    if (!account) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    }

    account.amount += amount; 
    await account.save();

    return NextResponse.json({ message: 'Deposit successful.', account }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
}