import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbAll, dbGet, dbRun } from '../db/connection.js';

const router = express.Router();

// Get all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await dbAll('SELECT * FROM chart_of_accounts ORDER BY accountNumber ASC');
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get account by ID
router.get('/:id', async (req, res) => {
  try {
    const account = await dbGet('SELECT * FROM chart_of_accounts WHERE id = ?', [req.params.id]);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new account
router.post('/', async (req, res) => {
  const { accountNumber, name, type, parentAccount, description } = req.body;

  if (!accountNumber || !name || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const id = uuidv4();
    await dbRun(
      `INSERT INTO chart_of_accounts (id, accountNumber, name, type, parentAccount, description, balance)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [id, accountNumber, name, type, parentAccount, description]
    );

    const account = await dbGet('SELECT * FROM chart_of_accounts WHERE id = ?', [id]);
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update account
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;

  try {
    await dbRun(
      'UPDATE chart_of_accounts SET name = ?, description = ? WHERE id = ?',
      [name, description, req.params.id]
    );

    const account = await dbGet('SELECT * FROM chart_of_accounts WHERE id = ?', [req.params.id]);
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get account statement (transactions history)
router.get('/:id/statement', async (req, res) => {
  try {
    const entries = await dbAll(
      `SELECT j.* FROM journal_entries j
       WHERE j.debitAccount = ? OR j.creditAccount = ?
       ORDER BY j.entryDate DESC`,
      [req.params.id, req.params.id]
    );
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
