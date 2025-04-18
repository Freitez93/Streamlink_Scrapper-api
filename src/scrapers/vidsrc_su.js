import axios from "axios";

class vidSrcSuResolver {
	constructor() {
		this.ORIGIN = 'https://vidsrc.su'; // URL base para la API de Embed69
		this.PATHNAME = ''
		this.embedResponse = {
			server: 'VidSrc.su',
			status: 'error',
			url: '',
			sources: [],
			subtitles: []
		};
	}

	async getSources(ID, season, episode) {
		this.PATHNAME = season && episode
			? `tv/${ID}/${season}/${episode}`
			: `movie/${ID}`;

		this.embedResponse.url = `${this.ORIGIN}/embed/${this.PATHNAME}`;
		try {
			// Realizar la solicitud GET
			const response = await axios.get(this.embedResponse.url);

			// Verificar si la respuesta es exitosa
			if (response.status === 200) {
				// Extraer fuentes del código fuente
				const htmlContent = response.data;

				// Utilizar expresiones regulares para extraer los datos de las fuentes
				const sourcesRegex = /{ label: '(.*?)', url: '(.*?)' },/g;
				for (const match of htmlContent.matchAll(sourcesRegex)) {
					let [_, label, url] = match;

					if (url !== '') {
						this.embedResponse.sources.push({
							server: label || 'VidSrc.su',	// Nombre del servidor
							lang: 'English',				// Idioma por defecto
							url: decodeURIComponent(url)	// URL que contenga el .m3u8
						});
					}
				}

				// Extraer subtítulos del código fuente
				const subtitlesRegex = /{"id":.*?"url":"(.*?)".*?"display":"(.*?)"/g;
				for (const match of htmlContent.matchAll(subtitlesRegex)) {
					const [, url, display] = match;
					this.embedResponse.subtitles.push({
						file: url,			// Archivo srt
						label: display,		// Nombre completo del idioma
						kind: 'captions'	// Tipo
					});
				}
			}

			// Verificar si se agregaron fuentes
			if (this.embedResponse.sources.length > 0) {
				this.embedResponse.status = 'success';
			}

			return this.embedResponse;
		} catch (error) {
			throw new Error(`No se pudo recuperar el vídeo: ${error.message}`);
		}
	}
}

export default vidSrcSuResolver;