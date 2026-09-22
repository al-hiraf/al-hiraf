import { dbRun, getDatabase } from './connection.js';
import { v4 as uuidv4 } from 'uuid';

async function seedDatabase() {
  try {
    // Sample customers
    const customers = [
      {
        id: uuidv4(),
        name: 'شركة التقنية المتقدمة',
        email: 'info@techcorp.com',
        phone: '+966501234567',
        company: 'Tech Corp',
        address: 'الرياض',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
        notes: 'عميل منتظم'
      },
      {
        id: uuidv4(),
        name: 'مؤسسة البناء والتطوير',
        email: 'contact@buildco.com',
        phone: '+966509876543',
        company: 'Build Solutions',
        address: 'جدة',
        city: 'جدة',
        country: 'المملكة العربية السعودية',
        notes: 'عميل جديد'
      },
      {
        id: uuidv4(),
        name: 'مجموعة الخدمات المتكاملة',
        email: 'sales@servicesgroup.com',
        phone: '+966555123456',
        company: 'Services Group',
        address: 'الدمام',
        city: 'الدمام',
        country: 'المملكة العربية السعودية',
        notes: 'شراكة استراتيجية'
      }
    ];

    for (const customer of customers) {
      await dbRun(
        `INSERT INTO customers (id, name, email, phone, company, address, city, country, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [customer.id, customer.name, customer.email, customer.phone, customer.company, customer.address, customer.city, customer.country, customer.notes]
      );
    }

    console.log('✅ تم إضافة العملاء النموذجيين');

    // Sample invoices
    const invoices = [
      {
        id: uuidv4(),
        customerId: customers[0].id,
        invoiceNumber: 'INV-2024-001',
        description: 'خدمات تطوير البرمجيات',
        amount: 5000,
        tax: 750,
        totalAmount: 5750,
        status: 'paid',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        issueDate: new Date().toISOString(),
        paidDate: new Date().toISOString()
      },
      {
        id: uuidv4(),
        customerId: customers[1].id,
        invoiceNumber: 'INV-2024-002',
        description: 'مشروع البناء الأساسي',
        amount: 15000,
        tax: 2250,
        totalAmount: 17250,
        status: 'issued',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        issueDate: new Date().toISOString()
      },
      {
        id: uuidv4(),
        customerId: customers[2].id,
        invoiceNumber: 'INV-2024-003',
        description: 'خدمات الاستشارة والتدريب',
        amount: 8000,
        tax: 1200,
        totalAmount: 9200,
        status: 'partial',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        issueDate: new Date().toISOString()
      }
    ];

    for (const invoice of invoices) {
      await dbRun(
        `INSERT INTO invoices (id, customerId, invoiceNumber, description, amount, tax, totalAmount, status, dueDate, issueDate, paidDate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [invoice.id, invoice.customerId, invoice.invoiceNumber, invoice.description, invoice.amount, invoice.tax, invoice.totalAmount, invoice.status, invoice.dueDate, invoice.issueDate, invoice.paidDate]
      );

      // Add sample invoice items
      const items = [
        { description: 'ساعات العمل - مستشار أول', quantity: 20, unitPrice: 250 },
        { description: 'رسوم البرنامج', quantity: 1, unitPrice: invoice.amount - 5000 }
      ];

      for (const item of items) {
        if (item.unitPrice > 0) {
          await dbRun(
            `INSERT INTO invoice_items (id, invoiceId, description, quantity, unitPrice, totalPrice)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [uuidv4(), invoice.id, item.description, item.quantity, item.unitPrice, item.quantity * item.unitPrice]
          );
        }
      }
    }

    console.log('✅ تم إضافة الفواتير النموذجية');

    // Sample payments
    const payments = [
      {
        id: uuidv4(),
        invoiceId: invoices[0].id,
        customerId: customers[0].id,
        amount: 5750,
        paymentMethod: 'bank_transfer',
        reference: 'TRF-001',
        paymentDate: new Date().toISOString()
      },
      {
        id: uuidv4(),
        invoiceId: invoices[2].id,
        customerId: customers[2].id,
        amount: 5000,
        paymentMethod: 'check',
        reference: 'CHK-001',
        paymentDate: new Date().toISOString()
      }
    ];

    for (const payment of payments) {
      await dbRun(
        `INSERT INTO payments (id, invoiceId, customerId, amount, paymentMethod, reference, paymentDate)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [payment.id, payment.invoiceId, payment.customerId, payment.amount, payment.paymentMethod, payment.reference, payment.paymentDate]
      );
    }

    console.log('✅ تم إضافة المدفوعات النموذجية');
    console.log('');
    console.log('🎉 اكتمل إنشاء البيانات النموذجية بنجاح!');
    console.log('');

  } catch (error) {
    console.error('❌ خطأ في إنشاء البيانات النموذجية:', error);
  }
}

// Run seeding
seedDatabase().then(() => {
  const db = getDatabase();
  db.close();
});
