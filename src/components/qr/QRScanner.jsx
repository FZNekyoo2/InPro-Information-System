import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function QRScanner({ onScanSuccess, onClose }) {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const qrScannerRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    let ignore = false;
    let html5QrCode = null;

    const start = async () => {
      // Small delay to handle strict mode unmounting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // CRITICAL: Check if component was unmounted during the delay
      if (ignore) return;

      try {
        const element = document.getElementById("qr-reader");
        if (element) element.innerHTML = "";

        html5QrCode = new Html5Qrcode("qr-reader");
        qrScannerRef.current = html5QrCode;
        
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 320, height: 320 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            if (ignore) return;
            console.log('QR Code detected:', decodedText);
            setScanning(false);
            
            // Stop and cleanup
            html5QrCode.stop().then(() => {
                html5QrCode.clear();
                if (!ignore) onScanSuccess(decodedText);
            }).catch(err => console.error(err));
          },
          (errorMessage) => {
            // parse error, ignore
          }
        );
      } catch (err) {
        if (ignore) return;
        if (err?.name === 'Html5QrcodeError') return;
        
        setError('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
        console.error('Camera error:', err);
      }
    };

    start();

    return () => {
      ignore = true;
      if (html5QrCode) {
        try {
          if (html5QrCode.isScanning) {
            html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
          } else {
            html5QrCode.clear();
          }
        } catch (e) {
          console.error("Cleanup error", e);
        }
      }
    };
  }, []); // Empty dependency array

  const handleClose = () => {
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
