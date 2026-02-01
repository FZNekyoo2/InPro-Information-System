import { generateQRCode } from './src/utils/qrGenerator.js';

console.log('Starting QR Integration Test...');

(async () => {
    try {
        const result = await generateQRCode('TEST-FINAL-CHECK-123');
        console.log('Result:', result);
    } catch (error) {
        console.log('Test Failed:', error.message);
        console.log('Test Failed Stack:', error.stack);
    }
})();
