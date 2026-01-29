import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQRCode = async (kodeUnik) => {
  try {
    const qrDir = path.join(process.cwd(), 'uploads/qrcodes');

    // Create directory if it doesn't exist
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    const filename = `qr-${kodeUnik}-${Date.now()}.png`;
    const filepath = path.join(qrDir, filename);

    await QRCode.toFile(filepath, kodeUnik, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return `/uploads/qrcodes/${filename}`;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};
