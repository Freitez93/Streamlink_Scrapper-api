import axios from "axios";
import { load } from "cheerio";
import * as _string from "../utils/text.js";
import { getServerName } from "../utils/serverMap.js";

class playdedeResolver {
	constructor() {
		this.DOMAIN = 'https://www1.playdede.ws'
		this.responseData = {
			status: 'error',
			title: '',
			origin: '',
			source: [],
			subtitles: []
		};
	}

	async getSources({ type, title, year, season, episode } = {}) {
		this.responseData.title = title

		try {
			const searchResult = await this.searchByTitle(title);

			if (searchResult.length > 0) {
				for (const item of searchResult) {
					const isTitle = _string.isTitleEqual(item.title, title);
					const isYear = item.year.includes(year);

					if (isTitle && isYear) {
						const _search = {
							'movie': item.href,
							'tv': item.href.slice(0, -1).replace('serie/', 'episode/') + `-${season}x${episode}/`
						}[type];

						this.responseData.origin = _search;
						const { data: res } = await axios.get(_search);
						const $ = load(res);

						// Mapeo de códigos de idioma
						const languageMap = { '1559': 'Español', '29': 'Latino', '31': 'English' };

						// Buscar todos los elementos que contienen información de los videos
						$('.playerItem').each((index, element) => {
							const link = $(element).attr('data-loadplayer');
							const serverName = getServerName(link);

							// Obtener y traducir el código de idioma
							const languageCode = $(element).attr('data-lang');
							const language = languageMap[languageCode] || languageCode;
							const isType = language === 'English' ? ' SUB-Esp' : ' DUB';

							// Saltar enlaces de cuevana.ac
							if (link && link.includes('cuevana.ac')) {
								return;
							}

							this.responseData.source.push({
								server: serverName,
								lang: language + isType,
								url: link,
							});
						});
					}
				}
			}

			// Si hay resultados, se establece el estado como 'success'.
			if (this.responseData.source.length > 0) {
				this.responseData.status = 'success';
			}

			return this.responseData;
		} catch (error) {
			//console.trace(error.message);
			return this.responseData;
		}
	}

	async searchByTitle(title) {
		const _title = _string.createSlug(title)
		const search = `/?s=${_title.replace(/-/g, '+')}`

		try {
			const searchRes = await axios.get(this.DOMAIN + search);
			const $ = load(searchRes.data);

			const searchResult = [];
			$('article').each((index, element) => {
				const $href = $(element).find('a').attr('href');
				searchResult.push({
					title: $(element).find('.data > h3').text(),
					year: $(element).find('.data > p').text(),
					href: $href
				});
			});

			return searchResult;
		} catch (error) {
			console.log(`Error en SearchByTitle: ${error.message}`, error)
			return [];
		}
	}
}

export default playdedeResolver;