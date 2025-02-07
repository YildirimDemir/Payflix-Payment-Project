'use client';

import React, { useState } from 'react';
import Style from './depositmoneymodal.module.css';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface DepositMoneyProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string; 
  refreshAccount: () => void; 
}

const DepositMoneyModal: React.FC<DepositMoneyProps> = ({ isOpen, onClose, accountId, refreshAccount }) => {
  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid deposit amount.');
      return;
    }

    try {
      const response = await fetch(`/api/accounts/${accountId}/deposit-money`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        toast.success('Deposit successful!');
        setDepositAmount('');
        refreshAccount(); 
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'An error occurred.');
      }
    } catch (error) {
      toast.error('An error occurred while depositing money.');
    }
  };

  return (
    <div className={`${Style.modalArea} ${isOpen ? '' : Style.closed}`}>
      <div className={Style.modal}>
        <form onSubmit={handleDeposit}>
          <h2>Deposit Money</h2>
          <input
            type="number"
            placeholder="Enter deposit amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            required
          />
          <button className={Style.confirmBtn} type="submit">
            Confirm
          </button>
        </form>
        <button className={Style.closeModal} onClick={onClose}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default DepositMoneyModal;
