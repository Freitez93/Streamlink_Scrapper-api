import { unpack, detect } from "unpacker";
import CryptoJS from "crypto-js";
import { config } from "dotenv";

config()
const encryptedKey = process.env.ENCRYPT_AES_KEY;

/**
 * Desempaqueta una cadena en Base64
 * @param {string} packedString - Cadena empaquetada en Base64
 * @returns {string} Cadena desempaquetada
 */
export const UnPacked = (packedString) => {
	// Check if the input is Base64 encoded
	const isBase64 = !detect(packedString);

	// If Base64 encoded, decode it based on environment
	let decodedString = packedString;
	if (isBase64) {
		decodedString = typeof atob === "undefined"
			? Buffer.from(packedString, "base64").toString("binary")
			: atob(packedString);
	}

	// Unpack and return the result
	return unpack(decodedString);
};

/**
 * Desencripta un enlace usando AES
 * @param {string} encryptedLink - Enlace encriptado
 * @param {string} key - Clave de desencriptación
 * @returns {string} Enlace desencriptado
 */
export const decryptAESCryptoJS = (encryptedLink, key = encryptedKey) => {
	const bytes = CryptoJS.AES.decrypt(encryptedLink, key);
	const decryptedLink = bytes.toString(CryptoJS.enc.Utf8);
	return decryptedLink;
};

/**
 * Encrypts a given link using AES encryption and encodes the result in Base64 format.
 *
 * @param {string} encryptedLink - The link to be encrypted.
 * @param {string} key - The secret key used for encryption.
 * @returns {string} The AES encrypted and Base64 encoded link.
 */
export const encryptAESCryptoJS = (decryptedLink, key = encryptedKey) => {
	const encryptedLink = CryptoJS.AES.encrypt(decryptedLink, key);
	return encryptedLink;
};

// Encode String to Base64
export const encodeBase64 = value => {
	return CryptoJS.enc.Base64.parse(value.toString());
}

/**
 * Decode a Base64-encoded string to UTF-8 text
 * @param {string} encodedValue - The Base64-encoded string to decode
 * @returns {string} The decoded UTF-8 string
 * @throws {Error} If the input is not a valid Base64 string
 */
export const decodeBase64 = encodedValue => {
	try {
		const decodedWordArray = CryptoJS.enc.Base64.parse(encodedValue);
		const utf8String = decodedWordArray.toString(CryptoJS.enc.Utf8);
		return utf8String;
	} catch (error) {
		console.error('Error decoding Base64 string:', error);
		throw new Error('Invalid Base64 input: ' + error.message);
	}
}


/**
 * Descifra un enlace encriptado con AES que fue codificado en Base64
 * @param {string} encryptedLinkBase64 - Cadena codificada en Base64 que contiene IV y datos encriptados
 * @param {string} secretKey - Clave secreta utilizada para el descifrado
 * @returns {string|null} - Cadena descifrada o null si el descifrado falla
 */
export const decryptLinkByEmbed69 = (encryptedLinkBase64, secretKey) => {
	try {
		// Analizar la entrada en Base64
		const encryptedData = CryptoJS.enc.Base64.parse(encryptedLinkBase64);

		// Extraer IV (primeras 4 palabras) y contenido encriptado
		const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4));
		const encryptedContent = CryptoJS.lib.WordArray.create(encryptedData.words.slice(4));

		// Preparar la clave
		const key = CryptoJS.enc.Utf8.parse(secretKey);

		// Descifrar los datos
		const decrypted = CryptoJS.AES.decrypt(
			{
				ciphertext: encryptedContent
			},
			key,
			{
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			}
		);

		// Convertir a cadena UTF-8
		return decrypted.toString(CryptoJS.enc.Utf8);
	} catch (error) {
		console.error('Error al descifrar:', error);
		return null;
	}
}
