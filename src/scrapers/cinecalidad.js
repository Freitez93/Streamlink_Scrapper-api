import axios from "axios";
import { load } from "cheerio";
import * as _string from "../utils/text.js";
import { decodeBase64 } from "../utils/decode.js";
import { getServerName } from "../utils/serverMap.js";

class cinecalidadResolver {
	constructor() {
		this.DOMAIN = 'https://www.cinecalidad.vg'
		this.responseData = {
			status: 'error',
			title: '',
			origin: '',
			source: [],
			subtitles: []
		};
	}

	async getSources({ type, title, season, episode } = {}) {
		const _title = _string.createSlug(title)
		const path = {
			movie: `/pelicula/${_title}/`,
			tv: `/episodio/${_title}-${season}x${episode}/`
		}[type]

		this.responseData.title = title
		try {
			const response = await axios.get(this.DOMAIN + path);
			if (response.status !== 200)
				throw new Error(`Request failed with status code ${response.status}`);

			// Agregamos la URL de origen al objeto responseData
			this.responseData.origin = this.DOMAIN + path;

			const $ = load(response.data)
			const CAMRip = $('aside > p > span').last().text().includes('CAMRip')
				? ' CAMRip'
				: '';

			$('.options > li').each((index, element) => {
				const $link = $(element).find('a');
				const dataSrc = $link.attr('data-src');
				const decodeLink = decodeBase64(dataSrc)
				const serverName = getServerName(decodeLink);

				this.responseData.source.push({
					server: serverName,
					lang: 'Latino DUB' + CAMRip,
					url: decodeLink,
				});
			})

			// Verificamos si hay al menos un servidor disponible
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

export default cinecalidadResolver;