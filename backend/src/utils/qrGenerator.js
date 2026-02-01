import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let JimpImport = require('jimp');

// Handle different import structures (ESM/CJS interop)
const Jimp = JimpImport.Jimp || JimpImport.default || JimpImport;
const loadFont = JimpImport.loadFont || Jimp.loadFont;
const measureText = JimpImport.measureText || Jimp.measureText;

const FONT_SANS_32_BLACK = path.join(process.cwd(), 'node_modules/@jimp/plugin-print/fonts/open-sans/open-sans-32-black/open-sans-32-black.fnt');
const FONT_SANS_16_BLACK = path.join(process.cwd(), 'node_modules/@jimp/plugin-print/fonts/open-sans/open-sans-16-black/open-sans-16-black.fnt');
const AUTO = JimpImport.AUTO || Jimp.AUTO || -1;

if (typeof Jimp !== 'function') {
  console.error('CRITICAL: Jimp is still not a constructor:', Jimp);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQRCode = async (kodeUnik) => {
  try {
    const qrDir = path.join(process.cwd(), 'uploads/qrcodes');

    // Create directory if it doesn't exist
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    // 1. Setup paths and dimensions
    const logoPath = path.join(__dirname, '../assets/logo_pemko.png');
    const cardWidth = 400;
    const cardHeight = 600;
    const backgroundColor = 0xFFFFFFFF; // White

    // 2. Generate QR Buffer
    const qrBuffer = await QRCode.toBuffer(kodeUnik, {
      width: 250,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' }
    });

    // 3. Create Card and Load Images
    console.log('[QR] Starting generation for:', kodeUnik);
    console.log('[QR] CWD:', process.cwd());
    // 3. Create Card and Load Images
    // Use object syntax for Jimp constructor as verified
    let font;
    let card;
    let logo;
    let qrImage;

    // Check if loadFont is available
    if (typeof loadFont !== 'function') {
      console.warn('[QR] loadFont is not a function. Skipping card generation.');
      // Return simple QR path since we cannot create card
      // We need to save the qrBuffer to file first?
      // Or just use the Safe Fallback at the end of function

      // Let's use the fallback logic to save simple QR
      const filename = `qr-${kodeUnik}-${Date.now()}.png`;
      const filepath = path.join(qrDir, filename);
      await QRCode.toFile(filepath, kodeUnik);
      return `/uploads/qrcodes/${filename}`;
    }

    try {
      // Sequential loading to be safe
      card = new Jimp({ width: cardWidth, height: cardHeight, color: backgroundColor });

      // Try to load logo (optional)
      try {
        logo = await Jimp.read(logoPath);
      } catch (logoErr) {
        console.warn('[QR] Failed to load logo (skipping):', logoErr.message);
        logo = null;
      }

      // Load QR
      qrImage = await Jimp.read(qrBuffer);

      // Load Font
      if (fs.existsSync(FONT_SANS_32_BLACK)) {
        font = await loadFont(FONT_SANS_32_BLACK);
      } else {
        console.warn('[QR] Font file missing:', FONT_SANS_32_BLACK);
        // Try fallback if available, or fail
        if (Jimp.FONT_SANS_32_BLACK) {
          font = await loadFont(Jimp.FONT_SANS_32_BLACK);
        }
      }
    } catch (setupError) {
      console.error('[QR] Setup failed:', setupError);
      // Fallback to simple QR
      const filename = `qr-${kodeUnik}-${Date.now()}.png`;
      const filepath = path.join(qrDir, filename);
      await QRCode.toFile(filepath, kodeUnik);
      return `/uploads/qrcodes/${filename}`;
    }

    if (!font) {
      console.warn('[QR] No font loaded. Falling back to simple QR.');
      const filename = `qr-${kodeUnik}-${Date.now()}.png`;
      const filepath = path.join(qrDir, filename);
      await QRCode.toFile(filepath, kodeUnik);
      return `/uploads/qrcodes/${filename}`;
    }

    // 4. Composite Logo (if exists)
    let currentY = 40;
    if (logo && logo.bitmap && logo.bitmap.width > 0) {
      const targetWidth = 80;
      const scaleFactor = targetWidth / logo.bitmap.width;
      const targetHeight = Math.round(logo.bitmap.height * scaleFactor);

      if (targetHeight > 0) {
        try {
          logo.resize({ w: targetWidth, h: targetHeight });

          const logoX = (cardWidth - logo.bitmap.width) / 2;
          card.composite(logo, logoX, currentY);
          currentY += logo.bitmap.height + 20;
        } catch (resizeErr) {
          console.error('[QR] Resize failed:', resizeErr.message);
          currentY += 100;
        }
      }
    } else {
      currentY += 100; // Fallback spacing if logo fails
    }

    // 5. Add Texts
    try {
      const smallFont = await loadFont(FONT_SANS_16_BLACK); // Might fail too
      if (smallFont) {
        const titleText = "PEMERINTAH KOTA MEDAN";
        const titleWidth = measureText(smallFont, titleText);
        card.print({ font: smallFont, x: (cardWidth - titleWidth) / 2, y: currentY, text: titleText });
        currentY += 40;
      }
    } catch (smallFontErr) {
      // Ignore small font error
      console.warn('[QR] Small font error:', smallFontErr.message);
      currentY += 40;
    }

    // 6. Composite QR Code
    const qrX = (cardWidth - qrImage.bitmap.width) / 2;
    card.composite(qrImage, qrX, currentY);
    currentY += qrImage.bitmap.height + 20;

    // 7. Add Labels
    try {
      const smallFont = await loadFont(FONT_SANS_16_BLACK);
      if (smallFont) {
        const labelText = "Kode Unik Dokumen:";
        const labelWidth = measureText(smallFont, labelText);
        card.print({ font: smallFont, x: (cardWidth - labelWidth) / 2, y: currentY, text: labelText });
        currentY += 25;
      }
    } catch (e) { currentY += 25; }

    const codeWidth = measureText(font, kodeUnik);
    card.print({ font: font, x: (cardWidth - codeWidth) / 2, y: currentY, text: kodeUnik });

    // 8. Save using Buffer + fs to avoid Jimp.write bugs
    const filename = `qr-${kodeUnik}-${Date.now()}.png`;
    const filepath = path.join(qrDir, filename);

    console.log('[QR] Saving to:', filepath);

    // Explicitly use getBufferAsync or getBuffer callback wrapper
    // Jimp v1.0+ getBuffer returns a Promise
    const buffer = await card.getBuffer("image/png");

    await fs.promises.writeFile(filepath, buffer);
    console.log('[QR] Save success');

    return `/uploads/qrcodes/${filename}`;

  } catch (error) {
    const errorMsg = `[${new Date().toISOString()}] CRITICAL ERROR in generateQRCode: ${error.message}\nStack: ${error.stack}\n`;
    console.error(errorMsg);
    try {
      fs.appendFileSync(path.join(process.cwd(), 'error.txt'), errorMsg);
    } catch (logErr) {
      console.error('Failed to write log:', logErr);
    }
    // Fallback
    try {
      const qrDir = path.join(process.cwd(), 'uploads/qrcodes');
      const filename = `qr-fallback-${kodeUnik}-${Date.now()}.png`;
      const filepath = path.join(qrDir, filename);
      await QRCode.toFile(filepath, kodeUnik);
      return `/uploads/qrcodes/${filename}`;
    } catch (fallbackError) {
      throw error;
    }
  }
};
