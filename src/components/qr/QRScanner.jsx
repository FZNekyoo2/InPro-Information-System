import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function QRScanner({ onScanSuccess, onClose }) {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const qrScannerRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      qrScannerRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // QR Code detected successfully
          console.log('QR Code detected:', decodedText);
          setScanning(false);
          stopScanner();
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Parse error, ignore
        }
      );
      isRunningRef.current = true;
    } catch (err) {
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
      console.error('Camera error:', err);
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current && isRunningRef.current) {
      qrScannerRef.current.stop()
        .then(() => {
          isRunningRef.current = false;
          console.log('Scanner stopped');
        })
        .catch(err => {
          console.error('Error stopping scanner:', err);
        });
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <div className="qr-scanner-modal">
      <div className="qr-scanner-content">
        <div className="qr-scanner-header">
          <h3>📷 Scan QR Code</h3>
          <button onClick={handleClose} className="btn-close">×</button>
        </div>
        
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <div className="qr-scanner-viewport">
            <div id="qr-reader"></div>
            {scanning && (
              <p className="qr-scanner-hint">
                🎯 Arahkan kamera ke QR Code pada surat
              </p>
            )}
          </div>
        )}
        
        <button onClick={handleClose} className="btn btn-secondary">
          Tutup
        </button>
      </div>
    </div>
  );
}

export default QRScanner;
