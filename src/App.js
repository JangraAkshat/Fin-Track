import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import Analytics from './components/Analytics';
import TransactionTable from './components/TransactionTable';
import TransactionForm from './components/TransactionForm';
import Insights from './components/Insights';
import './styles/App.css';

// Separate component to access context
const AppContent = () => {
  const { darkMode } = useFinance();

  return (
    <div className={`app-wrapper ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar />
      <main className="content">
        <SummaryCards />
        <div className="main-grid">
          <div className="left-column">
            <Analytics />
            <TransactionTable />
          </div>
          <div className="right-column">
            <TransactionForm />
            <Insights />
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;