import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Body parsing middleware
app.use(express.json());

// Cloud Run & container healthcheck endpoints
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/_health', (_req, res) => {
  res.status(200).send('OK');
});

// Static files directories
const distPath = path.join(__dirname, 'dist');
const docsPath = path.join(__dirname, 'docs');
const staticPath = fs.existsSync(distPath) ? distPath : docsPath;

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}
if (fs.existsSync(docsPath)) {
  app.use('/docs', express.static(docsPath));
}

// SPA fallback: send index.html for any frontend route
app.get('*', (_req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('Achievers Club Community is starting...');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Production server listening on http://0.0.0.0:${port}`);
});
