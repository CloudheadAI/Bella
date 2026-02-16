/* ========================================
   BACKEND — Simple answer storage server
   Stores Bella's Q3 response to a JSON file
   ======================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ANSWERS_FILE = path.join(__dirname, 'answers.json');
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// CORS headers for local dev
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  // POST /api/answer — save Bella's response
  if (req.method === 'POST' && req.url === '/api/answer') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        // Read existing answers or create new
        let existing = { answers: [] };
        if (fs.existsSync(ANSWERS_FILE)) {
          existing = JSON.parse(fs.readFileSync(ANSWERS_FILE, 'utf8'));
        }

        existing.answers.push({
          timestamp: new Date().toISOString(),
          q1: data.q1 || null,
          q2: data.q2 || null,
          q3: data.q3 || null,
        });

        fs.writeFileSync(ANSWERS_FILE, JSON.stringify(existing, null, 2));

        res.writeHead(200, { ...CORS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { ...CORS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // GET /api/answers — read all saved answers (for you)
  if (req.method === 'GET' && req.url === '/api/answers') {
    let existing = { answers: [] };
    if (fs.existsSync(ANSWERS_FILE)) {
      existing = JSON.parse(fs.readFileSync(ANSWERS_FILE, 'utf8'));
    }
    res.writeHead(200, { ...CORS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify(existing, null, 2));
    return;
  }

  // Serve static frontend files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(FRONTEND_DIR, filePath);

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  ✦ Server running at http://localhost:${PORT}\n`);
  console.log(`  → Frontend served from: ${FRONTEND_DIR}`);
  console.log(`  → Answers saved to: ${ANSWERS_FILE}\n`);
});
