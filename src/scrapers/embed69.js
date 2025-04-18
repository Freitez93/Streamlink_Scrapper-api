import axios from "axios";
import { load } from "cheerio";
import { decryptLinkByEmbed69 } from "../utils/decode.js";
import { getServerName } from "../utils/serverMap.js";

class embed69Resolver {
	constructor() {
		this.DOMAIN = 'https://embed69.org'; // URL base para la API de Embed69
		this.DECRYPT_KEY = 'Ak7qrvvH4WKYxV2OgaeHAEg2a5eh16vE'; // Clave de descifrado para los enlaces
		this.responseData = {
			status: 'error',
			title: '',
			origin: '',
			source: [],
			subtitles: []
		};
	}

	async getSources({ type, imdb_id, title, season, episode } = {}) {
		const search = {
			movie: `/f/${imdb_id}/`,
			tv: `/f/${imdb_id}-${season}x${episode?.padStart(2, '0')}/`
		}[type]

		this.responseData.origin = this.DOMAIN + search;
		this.responseData.title = title
		try {
			const response = await axios.get(this.responseData.origin);
			if (response.status !== 200)
				throw new Error(`Request failed with status code ${response.status}`);

			const $ = load(response.data);
			const script = $("script:contains('function decryptLink')").html();
			if (!script)
				throw new Error('Could not find script');

			// Extraer la parte del texto que contiene el array
			const dataLinkString = script.match(/const dataLink = (\[.*?\];)/s)[1];

			// Eliminar el punto y coma final y convertir a objeto
			const dataLink = JSON.parse(dataLinkString.slice(0, -1));

			// LanguageMap
			const languageMap = { 'LAT': 'Latino', 'ESP': 'Español', 'SUB': 'English' }

			dataLink.map(key => {
				const language = key['video_language'];
				const sortVideos = key['sortedEmbeds'];
				const isType = language === 'SUB' ? ' SUB-Esp' : ' DUB'
				sortVideos.map(video => {
					if (video['servername'] === 'download') return;

					const serverUrl = decryptLinkByEmbed69(video['link'], this.DECRYPT_KEY)
					const serverName = getServerName(serverUrl)

					this.responseData.source.push({
						server: serverName,
						lang: languageMap[language] + isType,
						url: serverUrl
					});
				});
			});

			if (this.responseData.source.length > 0) {
				this.responseData.status = 'success';
			}

			return this.responseData;
		} catch (error) {
			//console.trace(error.message);
			return this.responseData;
		}
	}
}

export default embed69Resolver;