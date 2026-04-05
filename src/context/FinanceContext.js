import React, { createContext, useState, useContext, useEffect } from 'react';

const FinanceContext = createContext();

// Incremented version to force-clear old local storage data
const DATA_VERSION = "2.0"; 

export const FinanceProvider = ({ children }) => {
  const [role, setRole] = useState('admin');
  const [darkMode, setDarkMode] = useState(false);
  
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedVersion = localStorage.getItem('data_version');

    // If version mismatch or no data, load the new 8 transactions
    if (!savedTransactions || savedVersion !== DATA_VERSION) {
      const defaultData = [
        { id: 101, date: '2026-04-01', desc: 'Monthly Salary', amount: 95000, category: 'Income', type: 'income' },
        { id: 102, date: '2026-04-05', desc: 'Sushi Dinner', amount: 2400, category: 'Food', type: 'expense' },
        { id: 103, date: '2026-03-25', desc: 'Weekly Groceries', amount: 4200, category: 'Food', type: 'expense' },
        { id: 104, date: '2026-04-02', desc: 'Pharmacy - Vitamins', amount: 850, category: 'Health', type: 'expense' },
        { id: 105, date: '2026-03-15', desc: 'Dental Checkup', amount: 1500, category: 'Health', type: 'expense' },
        { id: 106, date: '2026-04-03', desc: 'High-Speed Internet', amount: 1200, category: 'Utilities', type: 'expense' },
        { id: 107, date: '2026-03-20', desc: 'Water & Gas Bill', amount: 450, category: 'Utilities', type: 'expense' },
        { id: 108, date: '2026-04-04', desc: 'Movie Night Out', amount: 900, category: 'Miscellaneous', type: 'expense' },
        { id: 109, date: '2026-03-10', desc: 'Gifts for Birthday', amount: 3000, category: 'Miscellaneous', type: 'expense' }
      ];
      
      // Save versioning info immediately
      localStorage.setItem('transactions', JSON.stringify(defaultData));
      localStorage.setItem('data_version', DATA_VERSION);
      return defaultData;
    }

    return JSON.parse(savedTransactions);
  });

  // Sync to LocalStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Load theme preference on initial mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const addTransaction = (newTx) => {
    if (role !== 'admin') return;
    setTransactions([{ ...newTx, id: Date.now() }, ...transactions]);
  };

  const deleteTransaction = (id) => {
    if (role !== 'admin') return;
    setTransactions(transactions.filter(tx => tx.id !== id));
  };

  return (
    <FinanceContext.Provider value={{ 
      role, setRole, 
      darkMode, toggleDarkMode, 
      transactions, addTransaction, deleteTransaction 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);