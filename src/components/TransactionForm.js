import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PlusCircle } from 'lucide-react';

const TransactionForm = () => {
  const { role, addTransaction } = useFinance();
  const [error, setError] = useState(false); // New state for validation
  const [formData, setFormData] = useState({
    desc: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const numericAmount = parseFloat(formData.amount);

    // Validate: must be a number AND greater than 0
    if (!formData.desc || isNaN(numericAmount) || numericAmount <= 0) {
      setError(true);
      // Remove the error highlight after 2 seconds
      setTimeout(() => setError(false), 2000);
      return;
    }
    
    setError(false);
    addTransaction({
      ...formData,
      amount: numericAmount
    });

    setFormData({ ...formData, desc: '', amount: '' });
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
            onChange={(e) => setFormData({...formData, desc: e.target.value})}
            required
          />
          <input 
            type="number" 
            placeholder="Amount (₹)"
            /* Add 'input-error' class if validation fails */
            className={error ? 'input-error' : ''}
            value={formData.amount}
            onChange={(e) => {
              setFormData({...formData, amount: e.target.value});
              if (error) setError(false); // Clear error as they type
            }}
            required
          />
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value="Food">Food</option>
            <option value="Income">Income</option>
            <option value="Utilities">Utilities</option>
            <option value="Health">Health</option>
            <option value="Shopping">Shopping</option>
            <option value="Miscellaneous">Misc</option>
          </select>
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="btn-add">
            <PlusCircle size={18} /> Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;