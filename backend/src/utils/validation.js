export const validateNIP = (nip) => {
  // NIP should be 18 digits
  return /^\d{18}$/.test(nip);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateNomorSurat = (nomorSurat) => {
  // Basic validation for letter number format
  return nomorSurat && nomorSurat.length >= 5;
};
