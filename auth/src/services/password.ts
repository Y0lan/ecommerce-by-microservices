import {randomBytes, scrypt} from 'crypto';
import {promisify} from 'util'

const scryptAsync = promisify(scrypt);

export class Password {

    static generateSalt() {
        return randomBytes(8).toString('hex');
    }

    static async hashPassword(password: string, salt: string) {
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer
        return buffer.toString('hex');
    }

    static async toHash(password: string) {
        const salt = Password.generateSalt();
        const buffer = await Password.hashPassword(password, salt)
        return `${buffer}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedStoredPassword, salt] = suppliedPassword.split('.');
        const hashedSuppliedPassword = await Password.hashPassword(suppliedPassword, salt)
        return hashedStoredPassword === hashedSuppliedPassword;
    }
}
