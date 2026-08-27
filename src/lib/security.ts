import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET_KEY || 'default-secret-key-32-chars-length!!'; // 32 bytes
const IV_LENGTH = 16;

/**
 * Encrypt sensitive string (e.g. Tredict API Key)
 */
export function encryptToken(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('[Security] Encryption failed:', error);
    // Return base64 obfuscated fallback if cipher fails in dev
    return Buffer.from(text).toString('base64');
  }
}

/**
 * Decrypt sensitive string
 */
export function decryptToken(encryptedText: string): string {
  try {
    if (!encryptedText.includes(':')) {
      return Buffer.from(encryptedText, 'base64').toString('utf8');
    }
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('[Security] Decryption failed:', error);
    return encryptedText;
  }
}
