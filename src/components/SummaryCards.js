import React from 'react';
import { useFinance } from '../context/FinanceContext';

const SummaryCards = () => {
  const { transactions } = useFinance();

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expenses;

  return (
    <div className="summary-container">
      <div className="card summary-card">
        <p>Total Balance</p>
        <h2>₹{balance.toLocaleString('en-IN')}</h2>
      </div>
      <div className="card summary-card border-success">
        <p>Total Income</p>
        <h2 className="text-success">+₹{income.toLocaleString('en-IN')}</h2>
      </div>
      <div className="card summary-card border-danger">
        <p>Total Expenses</p>
        <h2 className="text-danger">-₹{expenses.toLocaleString('en-IN')}</h2>
      </div>
    </div>
  );
};

export default SummaryCards;