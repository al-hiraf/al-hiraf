import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import customersRouter from './routes/customers.js';
import invoicesRouter from './routes/invoices.js';
import paymentsRouter from './routes/payments.js';
import reportsRouter from './routes/reports.js';
import journalRouter from './routes/journal.js';
import accountsRouter from './routes/accounts.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(join(__dirname, '../frontend')));

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/journal', journalRouter);
app.use('/api/accounts', accountsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Application: http://localhost:${PORT}`);
  console.log(``);
  console.log(`📊 API Endpoints:`);
  console.log(`   Customers: http://localhost:${PORT}/api/customers`);
  console.log(`   Invoices: http://localhost:${PORT}/api/invoices`);
  console.log(`   Payments: http://localhost:${PORT}/api/payments`);
  console.log(`   Reports: http://localhost:${PORT}/api/reports/dashboard`);
  console.log(``);
});
