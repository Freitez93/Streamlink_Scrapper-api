import axios from "axios"
import { load } from "cheerio"
import * as textTools from "../utils/text.js"
import { getServerName } from "../utils/serverMap.js";

class streamsitoResolver {
	constructor() {
		this.DOMAIN = 'https://xupalace.org'; // URL base para la API de Embed69
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
			movie: `/video/${imdb_id}/`,
			tv: `/video/${imdb_id}-${season}x${episode?.padStart(2, '0')}/`
		}[type]

		this.responseData.origin = this.DOMAIN + search;
		this.responseData.title = title
		try {
			const { data } = await axios.get(this.responseData.origin);
			const $ = load(data);

			// virifica si la pagina tiene un error
			const pageError = $('#ErrorWin div[role="texterror"]')?.text().includes("error");

			if (pageError) {
				throw new Error('Esta fuente de video o enlace tiene un error y no esta disponible.');
			}

			const options = {
				'Latino': $('.OD_1 > li[data-lang="0"]'),
				'Español': $('.OD_1 > li[data-lang="1"]'),
				'English': $('.OD_1 > li[data-lang="2"]')
			};

			for (const [language, elements] of Object.entries(options)) {
				if (elements.length === 0) continue;

				elements.each((_index, element) => {
					const onclick = $(element).attr('onclick');
					const videoUrl = textTools.substringBetween(onclick, "go_to_playerVast('", "',");
					const isType = language === 'English' ? 'SUB-Esp' : 'DUB';

					if (videoUrl.includes('embedsito.net')) return;
					if (videoUrl.includes('xupalace.org')) return;

					const server = getServerName(videoUrl);
					this.responseData.source.push({
						server: server,
						lang: `${language} ${isType}`,
						url: videoUrl
					});
				});
			}

			// Verificar si se agregaron fuentes
			if (this.responseData.sources.length > 0) {
				this.responseData.status = 'success';
			}

			return this.responseData;
		} catch (error) {
			//console.error(`Error al obtener las fuentes de video: ${error.message}`);
			return this.responseData;
		}
	}
}

export default streamsitoResolver;