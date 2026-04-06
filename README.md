# FinTrack — Finance Dashboard

A clean, interactive personal finance dashboard built with **React** and **CSS custom properties**. Designed as a frontend assignment to demonstrate component architecture, state management, role-based UI, and data visualisation.

---

## Live Demo

> Deploy via Vercel or Netlify by connecting your repository. No backend required — all data is handled client-side.

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fintrack.git
cd fintrack

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite) or `http://localhost:3000` (Create React App).

### Build for Production

```bash
npm run build
```

---

## Project Structure

```
src/
├── assets/
│   ├── logo-light.png       # Logo shown in light mode
│   └── logo-dark.png        # Logo shown in dark mode
├── components/
│   ├── Navbar.jsx            # Top navigation, role toggle, dark mode
│   ├── SummaryCards.jsx      # Balance / Income / Expense summary
│   ├── Analytics.jsx         # Line chart (trend) + Pie chart (breakdown)
│   ├── TransactionTable.jsx  # Filterable, sortable, exportable table
│   ├── TransactionForm.jsx   # Add transaction form (admin only)
│   └── Insights.jsx          # Auto-generated spending insights
├── context/
│   └── FinanceContext.jsx    # Global state via React Context
├── styles/
│   └── App.css               # All styles — design tokens, layout, responsive
└── App.jsx                   # Root component and layout
```

---

## Features

### Dashboard Overview
- Three summary cards: **Total Balance**, **Total Income**, **Total Expenses** — each with a colour-coded icon and uppercase label for quick scanning
- **Net Balance Trend** — line chart showing cumulative balance over time (oldest → newest)
- **Expense Breakdown** — donut chart with spending by category

### Transactions
- Full transaction list with **date**, **description**, **category**, **type**, and **amount**
- **Search** by description
- **Filter** by category
- **Sort** by date (click the Date column header to toggle ascending / descending)
- **CSV export** — downloads currently filtered transactions as a `.csv` file

### Add Transaction Form
- Selecting the **Income** category automatically sets the type to `income`, preventing the common mistake of logging income as an expense
- Switching the type back to `expense` resets the category to Food if it was Income
- A subtle "Auto-set from category" hint appears when the sync is active

### Role-Based UI
Roles are simulated on the frontend with no backend dependency.

| Feature | Viewer | Admin |
|---|---|---|
| View transactions | ✓ | ✓ |
| View charts & insights | ✓ | ✓ |
| Add transactions | — | ✓ |
| Delete transactions | — | ✓ |

Switch roles using the **"To Admin / To Viewer"** button in the navbar. The add-transaction form animates in and out, and the delete column fades when switching roles.

### Insights
Automatically derived from transaction data:
- Highest spending category
- Total spend this period
- Current savings rate (%)
- Month-over-month spend comparison (current vs previous month)

### Empty States
All sections handle zero-data gracefully:
- Summary cards show ₹0 with a "No transactions yet" label
- Charts display a "No data" message instead of a broken graph
- Transaction table shows a contextual empty message

---

## Optional Enhancements Implemented

| Enhancement | Details |
|---|---|
| **Dark mode** | Full theme with CSS custom properties; logo cross-fades between light and dark variants |
| **Data persistence** | Transactions and theme preference saved to `localStorage`; versioned data reset on schema change |
| **Animations** | Row flash on add (green) and delete (red), form slide-in for admin mode, button scale on click |
| **CSV export** | Export filtered transactions from the table header |

---

## State Management

All global state lives in a single **React Context** (`FinanceContext`):

- `transactions` — array of transaction objects, initialised from `localStorage`
- `role` — `'admin'` or `'viewer'`, controls UI permissions
- `darkMode` — boolean, persisted to `localStorage`
- `addTransaction(tx)` — guarded by role check
- `deleteTransaction(id)` — guarded by role check

No external state library is used; the data shape is simple enough that Context + `useState` is the right tool.

---

## Design Decisions

- **CSS custom properties** for theming — a single `:root` block and a `.dark-mode` override handle the entire colour system, keeping component styles theme-agnostic.
- **No UI library** — all components are hand-styled for full control over layout and transitions.
- **Recharts** for data visualisation — lightweight, composable, and SSR-friendly.
- **Versioned localStorage** — a `DATA_VERSION` constant forces a clean reset when the default data shape changes, avoiding stale state bugs during development.
- **Static legend on pie chart** — always shows all four categories even when some have zero spend, preventing layout shifts as data changes.

---

## Assumptions

- All amounts are in **Indian Rupees (₹)**
- "This month" and "last month" comparisons use the browser's local date
- The app uses mock/static seed data; there is no real backend or authentication
- Role switching is for demonstration only — it does not represent a secure RBAC system

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Recharts | Charts |
| Lucide React | Icons |
| CSS custom properties | Theming and design tokens |
| localStorage | Client-side persistence |
| Vite | Build tool |
