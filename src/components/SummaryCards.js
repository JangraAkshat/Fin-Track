import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCards = () => {
  const { transactions } = useFinance();

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expenses;

  const cards = [
    {
      label: 'Total Balance',
      value: `₹${balance.toLocaleString('en-IN')}`,
      icon: Wallet,
      iconBg: 'rgba(37,99,235,0.1)',
      iconColor: '#2563eb',
      valueClass: '',
      borderClass: '',
    },
    {
      label: 'Total Income',
      value: `+₹${income.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      iconBg: 'rgba(16,185,129,0.1)',
      iconColor: '#10b981',
      valueClass: 'text-success',
      borderClass: 'border-success',
    },
    {
      label: 'Total Expenses',
      value: `-₹${expenses.toLocaleString('en-IN')}`,
      icon: TrendingDown,
      iconBg: 'rgba(239,68,68,0.1)',
      iconColor: '#ef4444',
      valueClass: 'text-danger',
      borderClass: 'border-danger',
    },
  ];

  return (
    <div className="summary-container">
      {cards.map(({ label, value, icon: Icon, iconBg, iconColor, valueClass, borderClass }) => (
        <div key={label} className={`card summary-card ${borderClass}`}>
          <div className="summary-card-top">
            <span className="summary-label">{label}</span>
            <span className="summary-icon-wrap" style={{ background: iconBg }}>
              <Icon size={18} color={iconColor} strokeWidth={2} />
            </span>
          </div>
          {transactions.length === 0 ? (
            <>
              <h2 className="summary-value" style={{ color: 'var(--text-light)' }}>₹0</h2>
              <span className="summary-sub">No transactions yet</span>
            </>
          ) : (
            <h2 className={`summary-value ${valueClass}`}>{value}</h2>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
