import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbAll, dbGet, dbRun } from '../db/connection.js';

const router = express.Router();

// Get all invoices with customer info
router.get('/', async (req, res) => {
  try {
    const invoices = await dbAll(`
      SELECT i.*, c.name as customerName, c.email as customerEmail
      FROM invoices i
      JOIN customers c ON i.customerId = c.id
      ORDER BY i.issueDate DESC
    `);
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get invoice by ID with items
router.get('/:id', async (req, res) => {
  try {
    const invoice = await dbGet(
      `SELECT i.*, c.name as customerName, c.email as customerEmail
       FROM invoices i
       JOIN customers c ON i.customerId = c.id
       WHERE i.id = ?`,
      [req.params.id]
    );

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const items = await dbAll('SELECT * FROM invoice_items WHERE invoiceId = ?', [req.params.id]);
    invoice.items = items;

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create invoice
router.post('/', async (req, res) => {
  const { customerId, invoiceNumber, description, items, dueDate, status = 'draft', notes } = req.body;

  if (!customerId || !invoiceNumber || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const id = uuidv4();

    // Calculate totals
    let amount = 0;
    let tax = 0;

    items.forEach(item => {
      amount += item.quantity * item.unitPrice;
    });

    // Simple tax calculation (e.g., 15% for Saudi VAT)
    tax = amount * 0.15;
    const totalAmount = amount + tax;

    // Insert invoice
    await dbRun(
      `INSERT INTO invoices (id, customerId, invoiceNumber, description, amount, tax, totalAmount, status, dueDate, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, customerId, invoiceNumber, description, amount, tax, totalAmount, status, dueDate, notes]
    );

    // Insert items
    for (const item of items) {
      const itemId = uuidv4();
      await dbRun(
        `INSERT INTO invoice_items (id, invoiceId, description, quantity, unitPrice, totalPrice)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [itemId, id, item.description, item.quantity, item.unitPrice, item.quantity * item.unitPrice]
      );
    }

    const invoice = await dbGet('SELECT * FROM invoices WHERE id = ?', [id]);
    const invoiceItems = await dbAll('SELECT * FROM invoice_items WHERE invoiceId = ?', [id]);

    res.status(201).json({ ...invoice, items: invoiceItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update invoice status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const paidDate = status === 'paid' ? new Date().toISOString() : null;

    await dbRun(
      `UPDATE invoices
       SET status = ?, paidDate = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, paidDate, req.params.id]
    );

    const invoice = await dbGet('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM invoice_items WHERE invoiceId = ?', [req.params.id]);
    await dbRun('DELETE FROM invoices WHERE id = ?', [req.params.id]);
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
