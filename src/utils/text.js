// textTools.js
import { levenshteinDistance } from "./object.js";


/**
 * Compara dos textos y devuelve true si son iguales, false en caso contrario.
 * @param {string} one - Primer texto a comparar.
 * @param {string} two - Segundo texto a comparar.
 * @returns {boolean} - True si los textos son iguales, false en caso contrario.
 */
export const isTextEqual = (one = '', two = '') => {
	return (one?.toLowerCase() ?? '') === (two?.toLowerCase() ?? '');
};

/**
 * Compara dos cadenas de título para determinar su similitud usando la distancia de Levenshtein.
 * Normaliza las cadenas convirtiéndolas a minúsculas y eliminando espacios en blanco,
 * luego calcula el ratio de similitud. Los títulos se consideran iguales si
 * la similitud es al menos 0.4 (40%).
 * 
 * @param {string} one - Primera cadena de título a comparar (por defecto es cadena vacía)
 * @param {string} two - Segunda cadena de título a comparar (por defecto es cadena vacía)
 * @returns {boolean} Verdadero si los títulos son lo suficientemente similares para considerarse iguales
 */
export const isTitleEqual = (one = '', two = '') => {
	const normalize = str => str.toLowerCase().split(/\s+/).join('');
	const a = normalize(one);
	const b = normalize(two);

	const maxLength = Math.max(a.length, b.length);
	const distance = levenshteinDistance(a, b);
	const similarity = 1 - (distance / maxLength);

	return similarity >= 0.4;
};

/**
 * Convierte un texto con guiones a formato título.
 * @param {string} texto - Texto a convertir (ej: "nombre-de-titulo").
 * @returns {string} Texto en formato título (ej: "Nombre De Titulo").
 */
export const toTitleCase = (texto) => {
	return texto
		.split('-')																	// Dividir el texto por los guiones
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())	// Capitalizar la primera letra de cada palabra
		.join(' ');																	// Unir las palabras con espacios
};

/**
 * Crea un slug a partir de un string.
 * @param {string} str - Texto original.
 * @returns {string} Texto en formato slug.
 */
export const createSlug = (str) => {
	return str
		.normalize('NFKD')					// Normalizar caracteres Unicode
		.replace(/[\u0300-\u036f]/g, '')	// Eliminar acentos
		.toLowerCase()						// Convertir a minúsculas
		.replace(/[^a-z0-9]+/g, '-')		// Reemplazar caracteres no alfanuméricos por guiones
		.replace(/^-|-$/g, '');				// Eliminar guiones al inicio o final
};

/**
 * Genera una cadena aleatoria segura
 * @param {number} length - Longitud de la cadena (default: 10)
 * @returns {string} Cadena aleatoria
 */
export const getRandomString = (length = 10) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	return Array.from(crypto.getRandomValues(new Uint32Array(length)))
		.map(x => characters[x % characters.length])
		.join('');
};

/**
 * Extrae el texto después de la primera aparición de una palabra.
 * @param {string} str - Texto original.
 * @param {string} start - Palabra a buscar.
 * @returns {string} Texto extraído o cadena vacía si no se encuentra.
 */
export const substringAfter = (str, start) => {
	if (typeof str !== "string" || typeof start !== "string") {
		throw new Error('Todos los argumentos deben ser de tipo string');
	}

	const index = str.indexOf(start);
	return index !== -1 ? str.substring(index + start.length) : '';
};

/**
 * Extrae el texto antes de la primera aparición de una palabra.
 * @param {string} str - Texto original.
 * @param {string} end - Palabra a buscar.
 * @returns {string} Texto extraído o cadena vacía si no se encuentra.
 */
export const substringBefore = (str, end) => {
	if (typeof str !== "string" || typeof end !== "string") {
		throw new Error('Todos los argumentos deben ser de tipo string');
	}

	const index = str.indexOf(end);
	return index !== -1 ? str.substring(0, index) : '';
};

/**
 * Extrae el texto entre dos palabras.
 * @param {string} str - Texto original.
 * @param {string} start - Palabra inicial.
 * @param {string} end - Palabra final.
 * @returns {string} Texto extraído o cadena vacía si no se encuentra.
 */
export const substringBetween = (str, start, end) => {
	if (typeof str !== "string" || typeof start !== "string" || typeof end !== "string") {
		throw new Error('Todos los argumentos deben ser de tipo string');
	}

	const startIndex = str.indexOf(start);
	if (startIndex === -1) return '';

	const fromStart = startIndex + start.length;
	const endIndex = str.indexOf(end, fromStart);
	return endIndex === -1 ? '' : str.substring(fromStart, endIndex);
};