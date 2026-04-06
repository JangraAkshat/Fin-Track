import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Lightbulb } from 'lucide-react';

const Insights = () => {
  const { transactions } = useFinance();

  if (transactions.length === 0) {
    return (
      <div className="card insights-card">
        <div className="insights-header">
          <Lightbulb size={20} color="#f59e0b" />
          <h3>Smart Insights</h3>
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>
          No transactions yet. Add some to see insights.
        </p>
      </div>
    );
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const categories = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const highestCategory = Object.keys(categories).length > 0
    ? Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b)
    : 'None';

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const savingsRate = income > 0
    ? Math.max(0, Math.round(((income - totalExpense) / income) * 100))
    : 0;

  // Monthly comparison
  const currentMonthExpenses = expenses
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + curr.amount, 0);

  const lastMonthExpenses = expenses
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyDiff = currentMonthExpenses - lastMonthExpenses;
  const monthlyPct = lastMonthExpenses > 0
    ? Math.abs(Math.round((monthlyDiff / lastMonthExpenses) * 100))
    : null;

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const getMonthlyInsight = () => {
    if (lastMonthExpenses === 0 && currentMonthExpenses === 0) {
      return `No expense data for ${monthNames[lastMonth]} or ${monthNames[currentMonth]}.`;
    }
    if (lastMonthExpenses === 0) {
      return `First recorded expenses this month: ₹${currentMonthExpenses.toLocaleString('en-IN')}.`;
    }
    if (monthlyDiff > 0) {
      return (
        <>
          Spending is <strong style={{ color: 'var(--danger)' }}>up {monthlyPct}%</strong> vs{' '}
          {monthNames[lastMonth]} (₹{currentMonthExpenses.toLocaleString('en-IN')} vs ₹{lastMonthExpenses.toLocaleString('en-IN')}).
        </>
      );
    }
    if (monthlyDiff < 0) {
      return (
        <>
          Spending is <strong style={{ color: 'var(--success)' }}>down {monthlyPct}%</strong> vs{' '}
          {monthNames[lastMonth]} (₹{currentMonthExpenses.toLocaleString('en-IN')} vs ₹{lastMonthExpenses.toLocaleString('en-IN')}).
        </>
      );
    }
    return `Spending is unchanged vs ${monthNames[lastMonth]}.`;
  };

  return (
    <div className="card insights-card">
      <div className="insights-header">
        <Lightbulb size={20} color="#f59e0b" />
        <h3>Smart Insights</h3>
      </div>

      <ul className="insights-list">
        <li>Highest spending is in <strong>{highestCategory === 'Miscellaneous' ? 'Misc' : highestCategory}</strong>.</li>
        <li>You have spent <strong>₹{totalExpense.toLocaleString('en-IN')}</strong> this month.</li>
        <li>Your current savings rate is <strong>{savingsRate}%</strong>.</li>
        <li>{getMonthlyInsight()}</li>
      </ul>
    </div>
  );
};

export default Insights;
