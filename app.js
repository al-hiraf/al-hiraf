const API_URL = 'http://localhost:3001/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadDashboard();
});

// ===== NAVIGATION & SECTIONS =====
function switchSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });

    // Update page title
    const titles = {
        'dashboard': 'لوحة التحكم',
        'journal': 'القيود المحاسبية',
        'customers': 'إدارة العملاء',
        'invoices': 'الفواتير',
        'payments': 'المدفوعات',
        'accounts': 'الحسابات',
        'reports': 'التقارير',
        'settings': 'الإعدادات'
    };
    document.querySelector('.header-title').textContent = titles[sectionId] || 'الحرف المتكاملة';

    // Load section data
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'journal':
            loadJournal();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'invoices':
            loadInvoices();
            break;
        case 'payments':
            loadPayments();
            break;
        case 'accounts':
            loadAccounts();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.getElementById('customerForm').addEventListener('submit', handleCustomerSubmit);
    document.getElementById('invoiceForm').addEventListener('submit', handleInvoiceSubmit);
    document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmit);
}

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        // Simulate data loading
        document.getElementById('stat-balance').textContent = 'SR ' + formatNumber(45250);
        document.getElementById('stat-invoices-month').textContent = '12';
        document.getElementById('stat-pending').textContent = 'SR ' + formatNumber(18500);
        document.getElementById('stat-expenses').textContent = 'SR ' + formatNumber(12750);

        // Sample recent invoices
        const tbody = document.querySelector('#recentInvoicesTable tbody');
        tbody.innerHTML = `
            <tr>
                <td>INV-2024-001</td>
                <td>شركة التقنية</td>
                <td>SR 5,500</td>
                <td><span class="badge badge-success">مدفوعة</span></td>
                <td>2026-09-22</td>
            </tr>
            <tr>
                <td>INV-2024-002</td>
                <td>مجموعة الخدمات</td>
                <td>SR 8,000</td>
                <td><span class="badge badge-warning">معلقة</span></td>
                <td>2026-09-21</td>
            </tr>
            <tr>
                <td>INV-2024-003</td>
                <td>شركة البناء</td>
                <td>SR 12,500</td>
                <td><span class="badge badge-info">جزئياً</span></td>
                <td>2026-09-20</td>
            </tr>
        `;
    } catch (error) {
        showNotification('خطأ في تحميل البيانات', 'error');
    }
}

// ===== JOURNAL (ENTRIES) =====
function openJournalModal() {
    openModal('journalModal');
}

async function loadJournal() {
    try {
        const tbody = document.querySelector('#journalTable tbody');
        tbody.innerHTML = `
            <tr>
                <td>2026-09-22</td>
                <td>001</td>
                <td>البنك - حساب جاري</td>
                <td>إيداع مبلغ</td>
                <td>50,000</td>
                <td></td>
            </tr>
            <tr>
                <td>2026-09-22</td>
                <td>001</td>
                <td>الذمم المدينة</td>
                <td>إيداع مبلغ</td>
                <td></td>
                <td>50,000</td>
            </tr>
            <tr>
                <td>2026-09-21</td>
                <td>002</td>
                <td>المصاريف التشغيلية</td>
                <td>دفع رواتب</td>
                <td>15,000</td>
                <td></td>
            </tr>
            <tr>
                <td>2026-09-21</td>
                <td>002</td>
                <td>البنك</td>
                <td>دفع رواتب</td>
                <td></td>
                <td>15,000</td>
            </tr>
        `;
    } catch (error) {
        showNotification('خطأ في تحميل القيود', 'error');
    }
}

// ===== CUSTOMERS =====
async function loadCustomers() {
    try {
        const tbody = document.querySelector('#customersTable tbody');
        tbody.innerHTML = `
            <tr>
                <td><strong>شركة التقنية المتقدمة</strong></td>
                <td>info@techcorp.com</td>
                <td>+966501234567</td>
                <td>SR 12,500</td>
                <td>
                    <button class="btn btn-secondary btn-sm">تعديل</button>
                    <button class="btn btn-danger btn-sm">حذف</button>
                </td>
            </tr>
            <tr>
                <td><strong>مؤسسة البناء والتطوير</strong></td>
                <td>contact@buildco.com</td>
                <td>+966509876543</td>
                <td>SR 8,000</td>
                <td>
                    <button class="btn btn-secondary btn-sm">تعديل</button>
                    <button class="btn btn-danger btn-sm">حذف</button>
                </td>
            </tr>
            <tr>
                <td><strong>مجموعة الخدمات المتكاملة</strong></td>
                <td>sales@servicesgroup.com</td>
                <td>+966555123456</td>
                <td>SR 5,250</td>
                <td>
                    <button class="btn btn-secondary btn-sm">تعديل</button>
                    <button class="btn btn-danger btn-sm">حذف</button>
                </td>
            </tr>
        `;

        // Populate customer select
        const select = document.getElementById('invoiceCustomer');
        select.innerHTML = `
            <option value="">اختر عميل</option>
            <option value="1">شركة التقنية المتقدمة</option>
            <option value="2">مؤسسة البناء والتطوير</option>
            <option value="3">مجموعة الخدمات المتكاملة</option>
        `;
    } catch (error) {
        showNotification('خطأ في تحميل العملاء', 'error');
    }
}

function openCustomerModal() {
    document.getElementById('customerForm').reset();
    openModal('customerModal');
}

async function handleCustomerSubmit(e) {
    e.preventDefault();
    showNotification('تم حفظ العميل بنجاح', 'success');
    closeModal('customerModal');
    loadCustomers();
}

// ===== INVOICES =====
async function loadInvoices() {
    try {
        const tbody = document.querySelector('#invoicesTable tbody');
        tbody.innerHTML = `
            <tr>
                <td><strong>INV-2024-001</strong></td>
                <td>شركة التقنية</td>
                <td>SR 5,500</td>
                <td><span class="badge badge-success">مدفوعة</span></td>
                <td>2026-10-22</td>
                <td>
                    <button class="btn btn-secondary btn-sm">عرض</button>
                    <button class="btn btn-danger btn-sm">حذف</button>
                </td>
            </tr>
            <tr>
                <td><strong>INV-2024-002</strong></td>
                <td>مجموعة الخدمات</td>
                <td>SR 8,000</td>
                <td><span class="badge badge-warning">معلقة</span></td>
                <td>2026-10-21</td>
                <td>
                    <button class="btn btn-secondary btn-sm">عرض</button>
                    <button class="btn btn-danger btn-sm">حذف</button>
                </td>
            </tr>
            <tr>
                <td><strong>INV-2024-003</strong></td>
                <td>شركة البناء</td>
                <td>SR 12,500</td>
                <td><span class="badge badge-info">جزئياً</span></td>
                <td>2026-10-20</td>
                <td>
                    <button class="btn btn-secondary btn-sm">عرض</button>
                    <button class="btn btn-danger btn-sm">حذف</button>
                </td>
            </tr>
        `;
    } catch (error) {
        showNotification('خطأ في تحميل الفواتير', 'error');
    }
}

function openInvoiceModal() {
    document.getElementById('invoiceForm').reset();
    openModal('invoiceModal');
}

async function handleInvoiceSubmit(e) {
    e.preventDefault();
    showNotification('تم إنشاء الفاتورة بنجاح', 'success');
    closeModal('invoiceModal');
    loadInvoices();
}

// ===== PAYMENTS =====
async function loadPayments() {
    try {
        const tbody = document.querySelector('#paymentsTable tbody');
        tbody.innerHTML = `
            <tr>
                <td>2026-09-22</td>
                <td>شركة التقنية</td>
                <td>INV-2024-001</td>
                <td>SR 5,500</td>
                <td>تحويل بنكي</td>
                <td><span class="badge badge-success">مؤكدة</span></td>
            </tr>
            <tr>
                <td>2026-09-21</td>
                <td>شركة البناء</td>
                <td>INV-2024-003</td>
                <td>SR 7,000</td>
                <td>شيك</td>
                <td><span class="badge badge-success">مؤكدة</span></td>
            </tr>
            <tr>
                <td>2026-09-20</td>
                <td>مجموعة الخدمات</td>
                <td>INV-2024-002</td>
                <td>SR 2,500</td>
                <td>نقداً</td>
                <td><span class="badge badge-gray">معلقة</span></td>
            </tr>
        `;
    } catch (error) {
        showNotification('خطأ في تحميل المدفوعات', 'error');
    }
}

function openPaymentModal() {
    document.getElementById('paymentForm').reset();
    openModal('paymentModal');
}

async function handlePaymentSubmit(e) {
    e.preventDefault();
    showNotification('تم تسجيل المدفوعة بنجاح', 'success');
    closeModal('paymentModal');
    loadPayments();
}

// ===== ACCOUNTS =====
async function loadAccounts() {
    try {
        const tbody = document.querySelector('#accountsTable tbody');
        tbody.innerHTML = `
            <tr>
                <td>1010</td>
                <td>البنك - الحساب الجاري</td>
                <td>أصول</td>
                <td>SR 125,500</td>
                <td>
                    <button class="btn btn-secondary btn-sm">عرض</button>
                </td>
            </tr>
            <tr>
                <td>1020</td>
                <td>الخزينة (النقد)</td>
                <td>أصول</td>
                <td>SR 8,250</td>
                <td>
                    <button class="btn btn-secondary btn-sm">عرض</button>
                </td>
            </tr>
            <tr>
                <td>1030</td>
                <td>الذمم المدينة</td>
                <td>أصول</td>
                <td>SR 45,300</td>
                <td>
                    <button class="btn btn-secondary btn-sm">عرض</button>
                </td>
            </tr>
            <tr>
                <td>2010</td>
                <td>الذمم الدائنة</td>
                <td>خصوم</td>
                <td>SR 12,500</td>
                <td>
                    <button class="btn btn-secondary btn-sm">عرض</button>
                </td>
            </tr>
            <tr>
                <td>3010</td>
                <td>رأس المال</td>
                <td>حقوق ملكية</td>
                <td>SR 200,000</td>
                <td>
                    <button class="btn btn-secondary btn-sm">عرض</button>
                </td>
            </tr>
        `;
    } catch (error) {
        showNotification('خطأ في تحميل الحسابات', 'error');
    }
}

function openAccountModal() {
    openModal('accountModal');
}

// ===== REPORTS =====
async function loadReports() {
    // Reports are displayed statically in HTML
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} active`;
    alert.textContent = message;
    container.innerHTML = '';
    container.appendChild(alert);

    setTimeout(() => {
        alert.classList.remove('active');
    }, 3000);
}

// ===== UTILITIES =====
function formatNumber(num) {
    return new Intl.NumberFormat('ar-SA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(num);
}

// Format currency
function formatCurrency(num) {
    return 'SR ' + formatNumber(num);
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('ar-SA');
}
