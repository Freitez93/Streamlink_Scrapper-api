import axios from "axios"
import { getServerName } from "../utils/serverMap.js";

class riveStreamResolver {
	constructor() {
		this.DOMAIN = 'https://scrapper.rivestream.org';
		this.PATHNAME = '/api/provider';
		this.responseData = {
			status: 'error',
			title: '',
			origin: '',
			source: [],
			subtitles: []
		};
	}


	async getSources({ type, tmdb_id, original_title, season, episode } = {}) {
		const search = {
			movie: `?id=${tmdb_id}`,
			tv: `?&id=${tmdb_id}&season=${season}&episode=${episode}`
		}[type]

		this.responseData.origin = `https://rivestream.org/watch${search}&type=${type}`;
		this.responseData.title = original_title
		try {
			const { data: resServerList } = await axios.get(`${this.DOMAIN + this.PATHNAME}s`);
			const serverList = resServerList.data;

			// Crear un array de promesas para cada servidor
			const serverPromises = serverList.map(server =>
				axios.get(this.DOMAIN + this.PATHNAME + search + `&provider=${server}`, { timeout: 4000 })
					.then(({ data: res }) => {
						// Procesar subtítulos
						res.data?.captions?.forEach(sub => {
							this.responseData.subtitles.push({
								lang: sub?.label?.split(' - ')[0] || "Unknown",
								url: sub?.file,
							});
						});

						// Procesar fuentes
						res.data?.sources?.forEach(key => {
							this.responseData.source.push({
								server: key.source,
								lang: this.getSubOrDub(key.quality, key.source),
								url: key.url
							});
						});
					}).catch(error => {
						console.error(`Error en el servidor ${server}: ${error.message}`);
						// No relanzar el error para que Promise.all no falle
					})
			);

			// Esperar a que todas las promesas se resuelvan (exitosas o no)
			await Promise.all(serverPromises);
			if (this.responseData.source.length > 0) {
				this.responseData.status = 'success';
			}

			return this.responseData;
		} catch (error) {
			//console.error(`Error al obtener las fuentes de video: ${error.message}`);
			return this.responseData;
		}
	}

	getSubOrDub(quality, source) {
		//console.log(`Source: ${source} Quality: ${quality}`)
		switch (source) {
			case '#Hà Nội (Vietsub) (Full)':
			case '#Hà Nội (Vietsub) (Tập 01)':
			case '#Hà Nội (Vietsub) (Tập 02)':
				return 'English SUB-Viet'
			case 'PutaFilme':
				return 'Portuguese DUB'
			case 'FlowCast':
				return `English ${quality}`
			case 'AsiaCloud':
				if (quality === 'English')
					return 'English';
				else
					return `${quality} DUB`;
			case 'FilmEcho':
				if (quality === 'Auto')
					return 'Multilingual';
				else if (quality === 'Mid HD')
					return 'Multilingual 720p';
				else if (quality === 'Low HD')
					return 'Multilingual 480p';
			default:
				return 'English'
		}
	}
}

export default riveStreamResolver;