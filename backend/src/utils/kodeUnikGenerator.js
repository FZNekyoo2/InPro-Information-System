/**
 * Generate Kode Unik untuk surat dengan format ST-HHHHHHAAAA
 * H = Huruf (A-Z)
 * A = Angka (0-9)
 */
export const generateKodeUnik = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = 'ST-';

  // 6 Huruf
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    result += letters[randomIndex];
  }

  // 4 Angka
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result += numbers[randomIndex];
  }

  return result;
};

/**
 * Validasi format kode unik
 * @param {string} kode - Kode unik yang akan divalidasi
 * @returns {boolean}
 */
export const isValidKodeUnik = (kode) => {
  const regex = /^ST-[A-Z]{6}\d{4}$/;
  return regex.test(kode);
};
