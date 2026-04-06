import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PlusCircle } from 'lucide-react';

// Categories that are always income — syncs the type field automatically
const INCOME_CATEGORIES = ['Income'];

const TransactionForm = () => {
  const { role, addTransaction } = useFinance();
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    desc: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  // When category changes, auto-sync type if it's an income category
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const inferredType = INCOME_CATEGORIES.includes(category) ? 'income' : 'expense';
    setFormData(prev => ({ ...prev, category, type: inferredType }));
  };

  // When type changes manually, if switching to expense and category is 'Income', reset category
  const handleTypeChange = (e) => {
    const type = e.target.value;
    const category =
      type === 'expense' && INCOME_CATEGORIES.includes(formData.category)
        ? 'Food'
        : formData.category;
    setFormData(prev => ({ ...prev, type, category }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericAmount = parseFloat(formData.amount);

    if (!formData.desc || isNaN(numericAmount) || numericAmount <= 0) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }

    setError(false);
    addTransaction({ ...formData, amount: numericAmount });
    setFormData(prev => ({ ...prev, desc: '', amount: '' }));
  };

  return (
    <div className={`admin-only-container ${role === 'admin' ? 'active' : 'inactive'}`}>
      <div className="card form-card">
        <h3>Add Transaction</h3>
        <form onSubmit={handleSubmit} className="transaction-form">
          <input
            type="text"
            placeholder="Description"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            className={error ? 'input-error' : ''}
            value={formData.amount}
            onChange={(e) => {
              setFormData({ ...formData, amount: e.target.value });
              if (error) setError(false);
            }}
            required
          />
          <select value={formData.category} onChange={handleCategoryChange}>
            <option value="Food">Food</option>
            <option value="Income">Income</option>
            <option value="Utilities">Utilities</option>
            <option value="Health">Health</option>
            <option value="Shopping">Shopping</option>
            <option value="Miscellaneous">Misc</option>
          </select>

          {/* Type selector — visually indicates when it was auto-set */}
          <div className="type-select-wrapper">
            <select
              value={formData.type}
              onChange={handleTypeChange}
              className={
                INCOME_CATEGORIES.includes(formData.category) ? 'type-synced income' :
                formData.type === 'expense' ? 'type-synced expense' : ''
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            {INCOME_CATEGORIES.includes(formData.category) && (
              <span className="type-sync-hint">Auto-set from category</span>
            )}
          </div>

          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <button type="submit" className="btn-add">
            <PlusCircle size={18} /> Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
