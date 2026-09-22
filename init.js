import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'accounting.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  // Customers table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      company TEXT,
      address TEXT,
      city TEXT,
      country TEXT,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Invoices table
  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      customerId TEXT NOT NULL,
      invoiceNumber TEXT UNIQUE NOT NULL,
      description TEXT,
      amount REAL NOT NULL,
      tax REAL DEFAULT 0,
      totalAmount REAL NOT NULL,
      status TEXT DEFAULT 'draft',
      dueDate DATETIME,
      issueDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      paidDate DATETIME,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customerId) REFERENCES customers(id)
    )
  `);

  // Invoice items table
  db.run(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id TEXT PRIMARY KEY,
      invoiceId TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity REAL NOT NULL,
      unitPrice REAL NOT NULL,
      totalPrice REAL NOT NULL,
      FOREIGN KEY (invoiceId) REFERENCES invoices(id) ON DELETE CASCADE
    )
  `);

  // Payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      invoiceId TEXT NOT NULL,
      customerId TEXT NOT NULL,
      amount REAL NOT NULL,
      paymentMethod TEXT,
      paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      reference TEXT,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoiceId) REFERENCES invoices(id),
      FOREIGN KEY (customerId) REFERENCES customers(id)
    )
  `);

  // Financial transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      description TEXT,
      relatedId TEXT,
      transactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chart of Accounts table
  db.run(`
    CREATE TABLE IF NOT EXISTS chart_of_accounts (
      id TEXT PRIMARY KEY,
      accountNumber TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      parentAccount TEXT,
      description TEXT,
      balance REAL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Journal Entries table
  db.run(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      entryNo TEXT UNIQUE NOT NULL,
      entryDate DATETIME NOT NULL,
      description TEXT,
      debitAccount TEXT NOT NULL,
      debitAmount REAL NOT NULL,
      creditAccount TEXT NOT NULL,
      creditAmount REAL NOT NULL,
      reference TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (debitAccount) REFERENCES chart_of_accounts(id),
      FOREIGN KEY (creditAccount) REFERENCES chart_of_accounts(id)
    )
  `);

  console.log('Database initialized successfully!');
});

db.close(() => {
  console.log('Database connection closed');
});
