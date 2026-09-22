import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbAll, dbGet, dbRun } from '../db/connection.js';

const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await dbAll(`
      SELECT p.*, c.name as customerName, i.invoiceNumber
      FROM payments p
      JOIN customers c ON p.customerId = c.id
      JOIN invoices i ON p.invoiceId = i.id
      ORDER BY p.paymentDate DESC
    `);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payments for a customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const payments = await dbAll(
      `SELECT p.*, c.name as customerName, i.invoiceNumber
       FROM payments p
       JOIN customers c ON p.customerId = c.id
       JOIN invoices i ON p.invoiceId = i.id
       WHERE p.customerId = ?
       ORDER BY p.paymentDate DESC`,
      [req.params.customerId]
    );
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payments for an invoice
router.get('/invoice/:invoiceId', async (req, res) => {
  try {
    const payments = await dbAll(
      'SELECT * FROM payments WHERE invoiceId = ? ORDER BY paymentDate DESC',
      [req.params.invoiceId]
    );
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record a payment
router.post('/', async (req, res) => {
  const { invoiceId, customerId, amount, paymentMethod, reference, notes } = req.body;

  if (!invoiceId || !customerId || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const id = uuidv4();

    // Record payment
    await dbRun(
      `INSERT INTO payments (id, invoiceId, customerId, amount, paymentMethod, reference, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, invoiceId, customerId, amount, paymentMethod, reference, notes]
    );

    // Check if invoice is fully paid
    const invoice = await dbGet('SELECT * FROM invoices WHERE id = ?', [invoiceId]);
    const totalPaid = await dbGet(
      'SELECT SUM(amount) as total FROM payments WHERE invoiceId = ?',
      [invoiceId]
    );

    const paidAmount = totalPaid?.total || 0;

    if (paidAmount >= invoice.totalAmount) {
      await dbRun('UPDATE invoices SET status = ?, paidDate = CURRENT_TIMESTAMP WHERE id = ?', ['paid', invoiceId]);
    } else if (paidAmount > 0) {
      await dbRun('UPDATE invoices SET status = ? WHERE id = ?', ['partial', invoiceId]);
    }

    const payment = await dbGet('SELECT * FROM payments WHERE id = ?', [id]);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await dbGet('SELECT * FROM payments WHERE id = ?', [req.params.id]);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    await dbRun('DELETE FROM payments WHERE id = ?', [req.params.id]);

    // Update invoice status
    const totalPaid = await dbGet(
      'SELECT SUM(amount) as total FROM payments WHERE invoiceId = ?',
      [payment.invoiceId]
    );

    const invoice = await dbGet('SELECT * FROM invoices WHERE id = ?', [payment.invoiceId]);
    const paidAmount = totalPaid?.total || 0;

    let newStatus = 'draft';
    if (paidAmount >= invoice.totalAmount) {
      newStatus = 'paid';
    } else if (paidAmount > 0) {
      newStatus = 'partial';
    } else {
      newStatus = 'issued';
    }

    await dbRun('UPDATE invoices SET status = ? WHERE id = ?', [newStatus, payment.invoiceId]);

    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
