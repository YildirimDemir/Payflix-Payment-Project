'use client';

import Style from './account.module.css';
import { IAccount } from '@/models/accountModel';
import { getAccountById } from '@/services/apiAccounts';
import { createPayment } from '@/services/apiPayments'; 
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../ui/Loader';
import { FaMoneyBill, FaPlus, FaRegCopy } from 'react-icons/fa';
import DepositMoneyModal from './DepositMoneyModal/DepositMoneyModal';

export default function Account() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [account, setAccount] = useState<IAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Copied: ${text}`);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account?.accountNumber) {
      toast.error('Sender account number is not available.');
      return;
    }

    if (!receiverAccountNumber || !paymentAmount) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const paymentData = {
        senderAccountNumber: account.accountNumber,
        receiverAccountNumber,
        amount: parseFloat(paymentAmount),
      };

      const payment = await createPayment(paymentData);
      toast.success('Payment successful!');
      setReceiverAccountNumber('');
      setPaymentAmount('');
      refreshAccount();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Payment failed: ${error.message}`);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

  useEffect(() => {
    const getAccount = async () => {
      if (!user?.id) {
        console.error('Account ID is undefined');
        setLoading(false);
        return;
      }

      try {
        const fetchedAccount = await getAccountById(user.id);
        setAccount(fetchedAccount);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    getAccount();
  }, [user?.id]);

  const refreshAccount = async () => {
    try {
      const updatedAccount = await getAccountById(user?.id as string);
      setAccount(updatedAccount);
    } catch (error) {
      console.error('Error refreshing account:', error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  if (loading) return <Loader />;

  return (
    <div className={Style.accountPage}>
      <DepositMoneyModal
       isOpen={isModalOpen}
       onClose={toggleModal}
       accountId={account?._id || ''}
       refreshAccount={refreshAccount}
      />
        <div className={Style.accountUserWelcome}>
          <h2>Welcome, {account?.name}</h2>
        </div>
        <div className={Style.accountInfo}>
            <div className={Style.infoBox}>
                <h3>Account Info</h3>
                <div className={Style.textBox}>
                   <span>Name:</span>
                   <p className={Style.text} onClick={() => handleCopy(account?.name || '')}>  {account?.name}</p>
                </div>
                <div className={Style.textBox}>
                   <span>Account Number:</span>
                   <p className={Style.text} onClick={() => handleCopy(account?.accountNumber || '')}><FaRegCopy /> {account?.accountNumber}</p>
                </div>
            </div>
            <div className={Style.infoBox}>
                <h3>Amount</h3>
                <p className={Style.amount}>${account?.amount}</p>
                <button className={Style.depositMoney} onClick={toggleModal}><FaPlus /></button>
            </div>
            <div className={Style.infoBox}>
                <h3>Money Transfer</h3>
                <div className={Style.moneyTransfer}>
                    <form onSubmit={handleTransfer}>
                      <input
                        className={Style.accountNumberInput}
                        type="text"
                        placeholder='PYX-XXXX-XXXX'
                        maxLength={13}
                        value={receiverAccountNumber}
                        onChange={(e) => setReceiverAccountNumber(e.target.value)}
                        required
                      />
                      <input
                        className={Style.accountNumberInput}
                        type="number"
                        placeholder='Payment Amount'
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        required
                      />
                      <button className={Style.confirmBtn} type="submit">Confirm</button>
                    </form>
                </div>
            </div>
        </div>

        <div className={Style.lastTransactions}>
          <h2>Last Transactions</h2>
          <p>There is no any transactions</p>
        </div>
    </div>
  );
}
