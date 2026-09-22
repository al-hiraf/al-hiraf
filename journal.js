import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbAll, dbGet, dbRun } from '../db/connection.js';

const router = express.Router();

// Get all journal entries
router.get('/', async (req, res) => {
  try {
    const entries = await dbAll(`
      SELECT j.*, a1.name as debitAccountName, a2.name as creditAccountName
      FROM journal_entries j
      LEFT JOIN chart_of_accounts a1 ON j.debitAccount = a1.id
      LEFT JOIN chart_of_accounts a2 ON j.creditAccount = a2.id
      ORDER BY j.entryDate DESC
    `);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create journal entry
router.post('/', async (req, res) => {
  const { entryDate, description, debitAccount, debitAmount, creditAccount, creditAmount, reference } = req.body;

  if (!entryDate || !debitAccount || !debitAmount || !creditAccount || !creditAmount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (debitAmount !== creditAmount) {
    return res.status(400).json({ error: 'Debit and credit amounts must match' });
  }

  try {
    const id = uuidv4();
    const entryNo = Date.now().toString().slice(-6);

    await dbRun(
      `INSERT INTO journal_entries (id, entryNo, entryDate, description, debitAccount, debitAmount, creditAccount, creditAmount, reference)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, entryNo, entryDate, description, debitAccount, debitAmount, creditAccount, creditAmount, reference]
    );

    // Update account balances
    await updateAccountBalance(debitAccount, debitAmount, 'debit');
    await updateAccountBalance(creditAccount, creditAmount, 'credit');

    const entry = await dbGet('SELECT * FROM journal_entries WHERE id = ?', [id]);
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update account balance
async function updateAccountBalance(accountId, amount, type) {
  const account = await dbGet('SELECT * FROM chart_of_accounts WHERE id = ?', [accountId]);

  let newBalance = account.balance;
  if (type === 'debit') {
    newBalance += amount;
  } else {
    newBalance -= amount;
  }

  await dbRun('UPDATE chart_of_accounts SET balance = ? WHERE id = ?', [newBalance, accountId]);
}

export default router;
