import {randomBytes, scrypt} from 'crypto';
import {promisify} from 'util'

const scryptAsync = promisify(scrypt);

export class PasswordManager {

    static generateSalt() {
        return randomBytes(8).toString('hex');
    }

    static async hashPassword(password: string, salt: string) {
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer
        return buffer.toString('hex');
    }

    static async toHash(password: string) {
        const salt = PasswordManager.generateSalt();
        const buffer = await PasswordManager.hashPassword(password, salt)
        return `${buffer}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedStoredPassword, salt] = storedPassword.split('.');
        const hashedSuppliedPassword = await PasswordManager.hashPassword(suppliedPassword, salt)
        return hashedStoredPassword === hashedSuppliedPassword;
    }
}
