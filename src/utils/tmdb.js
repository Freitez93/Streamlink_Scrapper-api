import axios from "axios";

const random_Api_Key = getRandomKey();

/**
 * TMDb API client for fetching movie and TV show information
 */
class TMDb {
	/**
	 * Create a new TMDb client
	 * @param {Object} options - Configuration options
	 * @param {string} [options.api_key] - TMDb API key (random key used if not provided)
	 * @param {string} [options.language='es-MX'] - Preferred language for API responses
	 */
	constructor({ api_key, language } = {}) {
		this.api_key = api_key || random_Api_Key;
		this.language = language || 'es-MX';
	}

	/**
	 * Get detailed information for a movie or TV show by TMDb ID
	 * @param {string|number} TMDb_ID - The TMDb ID
	 * @param {string} TYPE - Content type ('movie', 'tv', or 'serie')
	 * @returns {Promise<Object>} Response with success flag and data or error
	 */
	async getInfoFromID(TMDb_ID, TYPE = 'movie') {
		try {
			// Validate type
			if (!['movie', 'tv'].includes(TYPE)) {
				throw new Error(`Tipo ${TYPE} inválido. Usar "movie" o "tv"`);
			}

			const url = `https://api.themoviedb.org/3/${normalizedType}/${TMDb_ID}`;

			const response = await axios.get(url, {
				params: {
					api_key: this.api_key,
					language: this.language
				}
			});

			return {
				success: true,
				data: response.data
			};
		} catch (error) {
			return {
				success: false,
				error: error.response?.data?.status_message || error.message
			};
		}
	}

	/**
	 * Get basic information for a movie or TV show by TMDb ID
	 * @param {string|number} TMDb_ID - The TMDb ID
	 * @param {string} TYPE - Content type ('movie' or 'tv')
	 * @returns {Promise<Object>} Response with success flag and basic data or error
	 */
	async getBasicInfo(TMDb_ID, TYPE = 'movie') {
		try {
			const url = `https://api.themoviedb.org/3/${TYPE}/${TMDb_ID}`;
			const response = await axios.get(url, {
				params: {
					api_key: this.api_key,
					language: this.language,
					append_to_response: 'external_ids'
				}
			});

			if (response.status !== 200) {
				throw new Error("Error al buscar en TMDb");
			}

			const data = response.data;

			return {
				success: true,
				data: {
					title: data.title || data.name,
					original_title: data.original_title || data.original_name,
					release_date: data.release_date || data.first_air_date,
					original_language: data.original_language,
					tmdb_id: TMDb_ID,
					imdb_id: data.imdb_id || data.external_ids.imdb_id
				}
			};
		} catch (error) {
			console.trace(error)
			return {
				success: false,
				error: error.response?.data?.status_message || error.message
			};
		}
	}

	/**
	 * Convert an IMDb ID to a TMDb ID
	 * @param {string} IMDb_ID - The IMDb ID (e.g., 'tt0137523')
	 * @returns {Promise<string|number|null>} TMDb ID or null if not found
	 */
	async getTMDbID(IMDb_ID) {
		try {
			const url = `https://api.themoviedb.org/3/find/${IMDb_ID}`;
			const response = await axios.get(url, {
				params: {
					api_key: this.api_key,
					language: this.language,
					external_source: 'imdb_id'
				}
			});

			if (response.status !== 200) {
				throw new Error("Error al buscar en TMDb");
			}

			return response.data.movie_results[0]?.id || null;
		} catch (error) {
			return null;
		}
	}
}

/**
 * Get a random TMDb API key from the predefined list
 * @returns {string} A random TMDb API key
 */

function getRandomKey() {
	const tmdb_keys = [
		'fb7bb23f03b6994dafc674c074d01761',
		'e55425032d3d0f371fc776f302e7c09b',
		'8301a21598f8b45668d5711a814f01f6',
		'8cf43ad9c085135b9479ad5cf6bbcbda',
		'da63548086e399ffc910fbc08526df05'
	];

	return tmdb_keys[Math.floor(Math.random() * tmdb_keys.length)];
}

export default TMDb;