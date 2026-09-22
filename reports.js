import express from 'express';
import { dbAll, dbGet } from '../db/connection.js';

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Total customers
    const customersCount = await dbGet('SELECT COUNT(*) as count FROM customers');

    // Total invoices and amounts
    const invoiceStats = await dbGet(`
      SELECT
        COUNT(*) as total,
        SUM(totalAmount) as totalAmount
      FROM invoices
    `);

    // Paid invoices
    const paidStats = await dbGet(`
      SELECT
        COUNT(*) as count,
        SUM(totalAmount) as amount
      FROM invoices
      WHERE status = 'paid'
    `);

    // Pending invoices
    const pendingStats = await dbGet(`
      SELECT
        COUNT(*) as count,
        SUM(totalAmount) as amount
      FROM invoices
      WHERE status IN ('draft', 'issued', 'partial')
    `);

    // Total payments
    const paymentStats = await dbGet('SELECT SUM(amount) as total FROM payments');

    // Recent invoices
    const recentInvoices = await dbAll(`
      SELECT i.*, c.name as customerName
      FROM invoices i
      JOIN customers c ON i.customerId = c.id
      ORDER BY i.issueDate DESC
      LIMIT 5
    `);

    res.json({
      customers: customersCount?.count || 0,
      invoices: {
        total: invoiceStats?.total || 0,
        amount: invoiceStats?.totalAmount || 0
      },
      paid: {
        count: paidStats?.count || 0,
        amount: paidStats?.amount || 0
      },
      pending: {
        count: pendingStats?.count || 0,
        amount: pendingStats?.amount || 0
      },
      totalPayments: paymentStats?.total || 0,
      recentInvoices
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Monthly revenue report
router.get('/revenue', async (req, res) => {
  try {
    const monthlyRevenue = await dbAll(`
      SELECT
        strftime('%Y-%m', issueDate) as month,
        COUNT(*) as invoiceCount,
        SUM(totalAmount) as totalAmount
      FROM invoices
      WHERE status != 'draft'
      GROUP BY strftime('%Y-%m', issueDate)
      ORDER BY month DESC
      LIMIT 12
    `);

    res.json(monthlyRevenue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer report
router.get('/customers', async (req, res) => {
  try {
    const customers = await dbAll(`
      SELECT
        c.id,
        c.name,
        c.email,
        c.company,
        COUNT(i.id) as invoiceCount,
        SUM(i.totalAmount) as totalSpent,
        SUM(CASE WHEN p.id IS NOT NULL THEN p.amount ELSE 0 END) as totalPaid
      FROM customers c
      LEFT JOIN invoices i ON c.id = i.customerId
      LEFT JOIN payments p ON i.id = p.invoiceId
      GROUP BY c.id
      ORDER BY totalSpent DESC
    `);

    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Outstanding invoices
router.get('/outstanding', async (req, res) => {
  try {
    const outstanding = await dbAll(`
      SELECT
        i.id,
        i.invoiceNumber,
        c.name as customerName,
        i.totalAmount,
        COALESCE(SUM(p.amount), 0) as paidAmount,
        i.totalAmount - COALESCE(SUM(p.amount), 0) as remainingAmount,
        i.dueDate,
        i.status
      FROM invoices i
      JOIN customers c ON i.customerId = c.id
      LEFT JOIN payments p ON i.id = p.invoiceId
      WHERE i.status IN ('issued', 'partial')
      GROUP BY i.id
      ORDER BY i.dueDate ASC
    `);

    res.json(outstanding);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Invoice status breakdown
router.get('/status-breakdown', async (req, res) => {
  try {
    const breakdown = await dbAll(`
      SELECT
        status,
        COUNT(*) as count,
        SUM(totalAmount) as amount
      FROM invoices
      GROUP BY status
    `);

    res.json(breakdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
