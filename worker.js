/**
 * Cloudflare Workers handler for Al-Hiraf API
 * This is the entry point for Cloudflare Workers deployment
 */

// Import route handlers
import { handleCustomers } from './routes/customers.js';
import { handleInvoices } from './routes/invoices.js';
import { handlePayments } from './routes/payments.js';
import { handleReports } from './routes/reports.js';
import { handleJournal } from './routes/journal.js';
import { handleAccounts } from './routes/accounts.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/**
 * Parse URL and extract route and method
 */
function parseRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  return { pathname, method, url };
}

/**
 * Main request handler
 */
async function handleRequest(request, env, ctx) {
  const { pathname, method } = parseRequest(request);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Route matching
  if (pathname === '/') {
    return serveStatic(request, env);
  }

  if (pathname.startsWith('/api/customers')) {
    return handleCustomers(request, env, ctx);
  }

  if (pathname.startsWith('/api/invoices')) {
    return handleInvoices(request, env, ctx);
  }

  if (pathname.startsWith('/api/payments')) {
    return handlePayments(request, env, ctx);
  }

  if (pathname.startsWith('/api/reports')) {
    return handleReports(request, env, ctx);
  }

  if (pathname.startsWith('/api/journal')) {
    return handleJournal(request, env, ctx);
  }

  if (pathname.startsWith('/api/accounts')) {
    return handleAccounts(request, env, ctx);
  }

  if (pathname === '/api/health') {
    return new Response(
      JSON.stringify({ status: 'Server is running', timestamp: new Date().toISOString() }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  // Static files or 404
  return serveStatic(request, env);
}

/**
 * Serve static files from R2 or return frontend
 */
async function serveStatic(request, env) {
  try {
    // Try to serve from R2 bucket if available
    if (env.BUCKET) {
      const url = new URL(request.url);
      const key = url.pathname === '/' ? 'index.html' : url.pathname;
      const object = await env.BUCKET.get(key);

      if (object) {
        return new Response(object.body, {
          headers: {
            'Content-Type': getContentType(key),
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    }
  } catch (err) {
    console.error('R2 error:', err);
  }

  // Fallback: return index.html for SPA routing
  return new Response(getFrontendHTML(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
  });
}

/**
 * Get content type based on file extension
 */
function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    html: 'text/html',
    js: 'application/javascript',
    css: 'text/css',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    svg: 'image/svg+xml',
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Fallback frontend HTML (embedded for SPA)
 */
function getFrontendHTML() {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>الحرف المتكاملة | Al-Hiraf Al-Mutakamila</title>
  <script src="/frontend/app.js" type="module"></script>
  <link rel="stylesheet" href="/frontend/style.css">
</head>
<body>
  <div id="root"></div>
  <p style="text-align: center; margin-top: 50px; color: #666;">Loading Al-Hiraf...</p>
</body>
</html>`;
}

/**
 * Cloudflare Workers export
 */
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },

  async scheduled(event, env, ctx) {
    // Handle scheduled tasks (cron jobs)
    console.log('Scheduled task executed');
  },
};
