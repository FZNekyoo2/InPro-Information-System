import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/templates'),
    path.join(__dirname, 'uploads/generated_surat'),
    path.join(__dirname, 'uploads/qrcodes')
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        console.log(`Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
    } else {
        console.log(`Directory exists: ${dir}`);
    }
});

console.log('All directories checked/created.');
