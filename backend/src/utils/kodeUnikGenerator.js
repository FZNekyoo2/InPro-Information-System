/**
 * Generate Kode Unik untuk surat dengan format ZT-XXXXXX
 * X = huruf atau angka random (A-Z, 0-9)
 */
export const generateKodeUnik = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ZT-';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  
  return result;
};

/**
 * Validasi format kode unik
 * @param {string} kode - Kode unik yang akan divalidasi
 * @returns {boolean}
 */
export const isValidKodeUnik = (kode) => {
  const regex = /^ZT-[A-Z0-9]{6}$/;
  return regex.test(kode);
};
