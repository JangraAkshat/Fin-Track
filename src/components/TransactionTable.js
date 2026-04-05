import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Trash2, Search, Filter } from 'lucide-react';

const TransactionTable = () => {
  const { transactions, role, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Track which ID is currently being deleted for the red animation
  const [deletingId, setDeletingId] = useState(null);

  const handleSafeDelete = (id) => {
    setDeletingId(id); // Trigger red flash
    setTimeout(() => {
      deleteTransaction(id); // Actually remove from global state after 300ms
      setDeletingId(null);
    }, 300);
  };

  // --- STATIC CATEGORIES CONFIG ---
  // We include 'Income' and 'Miscellaneous' (or 'Misc') by default so they always show in the filter
  const staticCategories = ['Food', 'Health', 'Income', 'Utilities', 'Miscellaneous'];
  
  // Create the final list for the dropdown: 'All' + Static list + any custom ones found in data
  const categories = [
    'All', 
    ...new Set([...staticCategories, ...transactions.map(t => t.category)])
  ];

  // Filtering & Sorting Logic
  const filteredAndSorted = transactions
    .filter(t => {
      const matchesSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="card table-card">
      <div className="table-header-container">
        <h3>Recent Transactions</h3>
        <div className="table-controls">
          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search size={16} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="filter-select-wrapper">
            <Filter size={16} color="#64748b" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'Miscellaneous' ? 'Misc' : c} {/* Display 'Misc' but value stays full */}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th className={`column-center transition-fade ${role === 'admin' ? 'visible' : 'hidden'}`}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((t, index) => (
              <tr 
                key={t.id} 
                className={`transaction-row 
                  ${index === 0 && !deletingId ? 'row-added' : ''} 
                  ${deletingId === t.id ? 'row-deleted' : ''}`}
              >
                <td className="td-date">{t.date}</td>
                <td className="td-desc">{t.desc}</td>
                <td>
                  <span className="badge">
                    {t.category === 'Miscellaneous' ? 'Misc' : t.category}
                  </span>
                </td>
                <td className={`td-amount ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                </td>
                <td className="column-center">
                  <div className={`transition-fade ${role === 'admin' ? 'visible' : 'hidden'}`}>
                    <button 
                      onClick={() => handleSafeDelete(t.id)} 
                      className="btn-delete-action"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredAndSorted.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
            No matching transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;