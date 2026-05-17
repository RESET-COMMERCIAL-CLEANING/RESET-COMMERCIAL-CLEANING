// Password encryption and decryption using base64 encoding
// Note: For production, use bcrypt or argon2. This is a basic implementation.

import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'reset-commercial-cleaning-key-2024';

export const encryptPassword = (password: string): string => {
  try {
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return password; // Fallback to plain text if encryption fails
  }
};

export const decryptPassword = (encryptedPassword: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedPassword; // Fallback to original if decryption fails
  }
};

export const verifyPassword = (plainPassword: string, encryptedPassword: string): boolean => {
  try {
    const decrypted = decryptPassword(encryptedPassword);
    return plainPassword === decrypted;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

export const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
