import * as Crypto from 'expo-crypto';

/**
 * Hashea una contraseña usando SHA-256
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} - Hash de la contraseña
 */
export const hashPassword = async (password) => {
    const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
    );
    return digest;
};

/**
 * Verifica si una contraseña coincide con el hash almacenado
 * @param {string} password - Contraseña en texto plano
 * @param {string} storedHash - Hash almacenado
 * @returns {Promise<boolean>} - True si coinciden
 */
export const verifyPassword = async (password, storedHash) => {
    const hash = await hashPassword(password);
    return hash === storedHash;
};
