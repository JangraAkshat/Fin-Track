import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Lightbulb } from 'lucide-react';

const Insights = () => {
  const { transactions } = useFinance();

  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  
  const categories = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const highestCategory = Object.keys(categories).reduce((a, b) => 
    categories[a] > categories[b] ? a : b, "None"
  );

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - totalExpense) / income) * 100)) : 0;

  return (
    <div className="card insights-card">
      {/* ADDED THIS WRAPPER TO MATCH OTHER HEADERS */}
      <div className="insights-header">
        <Lightbulb size={20} color="#f59e0b" />
        <h3>Smart Insights</h3>
      </div>
      
      <ul className="insights-list">
        <li>Highest spending is in <strong>{highestCategory === 'Miscellaneous' ? 'Misc' : highestCategory}</strong>.</li>
        <li>You have spent <strong>₹{totalExpense.toLocaleString('en-IN')}</strong> this month.</li>
        <li>Your current savings rate is <strong>{savingsRate}%</strong>.</li>
      </ul>
    </div>
  );
};

export default Insights;