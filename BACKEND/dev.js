import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('========================================================');
console.log(' Starting Esyus Fullstack Suite (Backend + Frontend)...');
console.log('========================================================\n');

// 1. Start Backend Server
const backend = spawn('node', ['server.js'], {
  cwd: path.join(root, 'BACKEND'),
  stdio: 'inherit',
  shell: true,
});

// 2. Start Frontend Dev Server
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(root, 'FRONTEND'),
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

