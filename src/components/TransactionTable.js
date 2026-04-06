import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Trash2, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';

const TransactionTable = () => {
  const { transactions, role, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first, 'asc' = oldest first
  const [deletingId, setDeletingId] = useState(null);

  const handleSafeDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteTransaction(id);
      setDeletingId(null);
    }, 300);
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filteredAndSorted.map(t => [
      t.date,
      `"${t.desc.replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.type === 'income' ? t.amount : -t.amount
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const staticCategories = ['Food', 'Health', 'Income', 'Utilities', 'Miscellaneous'];
  const categories = [
    'All',
    ...new Set([...staticCategories, ...transactions.map(t => t.category)])
  ];

  const filteredAndSorted = transactions
    .filter(t => {
      const matchesSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const diff = new Date(b.date) - new Date(a.date);
      return sortOrder === 'desc' ? diff : -diff;
    });

  const SortIcon = sortOrder === 'desc' ? ArrowDown : ArrowUp;

  return (
    <div className="card table-card">
      <div className="table-header-container">
        <h3>Recent Transactions</h3>
        <div className="table-controls">
          {/* Search */}
          <div className="search-input-wrapper">
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="filter-select-wrapper">
            <Filter size={16} color="#64748b" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'Miscellaneous' ? 'Misc' : c}
                </option>
              ))}
            </select>
          </div>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="btn-export"
            title="Export as CSV"
            disabled={filteredAndSorted.length === 0}
          >
            <Download size={15} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              {/* Sortable Date header */}
              <th
                className="th-sortable"
                onClick={toggleSort}
                title="Sort by date"
              >
                <span className="th-sort-inner">
                  Date
                  <SortIcon size={13} style={{ flexShrink: 0 }} />
                </span>
              </th>
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

        {filteredAndSorted.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
            {transactions.length === 0
              ? 'No transactions yet. Switch to Admin mode to add one.'
              : 'No matching transactions found.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
