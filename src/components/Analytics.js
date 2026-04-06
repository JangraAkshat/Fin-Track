import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useFinance } from '../context/FinanceContext';

const Analytics = () => {
  const { transactions, darkMode } = useFinance();

  // 1. Line Chart Data: Calculate Cumulative Balance (Oldest to Newest)
  const sortedForLine = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  let runningBalance = 0;
  const lineData = sortedForLine.map(t => {
    runningBalance += (t.type === 'income' ? t.amount : -t.amount);
    return { date: t.date, balance: runningBalance };
  });

  // 2. Pie Chart Data: Group Expenses by Category
  const expenseData = transactions.filter(t => t.type === 'expense');
  const categoryTotals = expenseData.reduce((acc, curr) => {
    // Map "Miscellaneous" to "Misc" for internal consistency if needed
    const cat = curr.category === 'Miscellaneous' ? 'Misc' : curr.category;
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = Object.keys(categoryTotals).map(key => ({
    name: key,
    value: categoryTotals[key]
  }));

  const colorMap = {
    'Food': '#f59e0b',
    'Health': '#ef4444',
    'Misc': '#2563eb',
    'Miscellaneous': '#2563eb',
    'Utilities': '#10b981'
  };

  const chartTextColor = darkMode ? "#94a3b8" : "#64748b";
  const gridColor = darkMode ? "#334155" : "#e2e8f0";

  const renderStaticLegend = () => {
    const staticItems = [
      { name: 'Food', color: colorMap['Food'] },
      { name: 'Health', color: colorMap['Health'] },
      { name: 'Misc', color: colorMap['Misc'] },
      { name: 'Utilities', color: colorMap['Utilities'] }
    ];

    return (
      <div className="custom-legend">
        {staticItems.map((item, index) => (
          <div key={`item-${index}`} className="legend-item">
            <span 
              className="legend-color-dot" 
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="legend-label">{item.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="analytics-section">
      {/* Net Balance Trend */}
      <div className="card chart-card">
        <h3>Net Balance Trend (₹)</h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="date" stroke={chartTextColor} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis 
                stroke={chartTextColor} 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#fff', 
                  border: `1px solid ${gridColor}`, 
                  borderRadius: '8px' 
                }}
                itemStyle={{ color: darkMode ? '#fff' : '#000' }}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#2563eb' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card chart-card pie-card-layout">
        <h3>Expense Breakdown</h3>
        <div className="pie-container" style={{ width: '100%', height: 350 }}>
          {pieData.length > 0 ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  isAnimationActive={false} 
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colorMap[entry.name] || '#8b5cf6'} 
                      stroke="none" 
                    />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                   contentStyle={{ 
                     backgroundColor: darkMode ? '#1e293b' : '#fff', 
                     border: `1px solid ${gridColor}`, 
                     borderRadius: '8px' 
                   }}
                />
                <Legend content={renderStaticLegend} verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">No expenses recorded</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;