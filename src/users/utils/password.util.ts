import * as bcrypt from 'bcrypt';

/**
 * Generates a salt and hashes the password using bcrypt.
 * @param password - The plain text password to hash.
 * @returns An object containing the salt and the hashed password.
 */
export async function generatePasswordHash(password: string): Promise<{ salt: string; hash: string }> {
  const salt = bcrypt.genSaltSync(10);
  const hash = await bcrypt.hash(password, salt);
  return { salt, hash };
}

/**
 * Hashes a password with a specific salt.
 * @param password - The plain text password.
 * @param salt - The salt to use for hashing.
 * @returns The hashed password.
 */
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  return bcrypt.hash(password, salt);
}

/**
 * Verifies if a plain text password matches the hashed password using the given salt.
 * @param password - The plain text password.
 * @param salt - The salt used for the original hash.
 * @param hashedPassword - The stored hashed password.
 * @returns True if the password matches, false otherwise.
 */
export async function verifyPassword(password: string, salt: string, hashedPassword: string): Promise<boolean> {
  const newHash = await hashPasswordWithSalt(password, salt);
  return newHash === hashedPassword;
}
