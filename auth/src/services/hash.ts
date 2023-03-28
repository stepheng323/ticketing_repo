import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export default class Password {
  static async toHash(text: string) {
    const salt = randomBytes(8).toString('hex');
    const buff = await scryptAsync(text, salt, 64) as Buffer;

    return `${buff.toString('hex')}.${salt}}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buff = await scryptAsync(suppliedPassword, salt, 64) as Buffer;
    return buff.toString('hex') === hashedPassword;
  }
}
