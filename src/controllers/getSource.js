
import TMDb from "../utils/tmdb.js";
import { PROVIDERS } from "./providers_list.js";
import { BadRequestError, NotFoundError, CustomError, } from "../middlewares/errorMiddleware.js";
import {
	cine24hResolver,
	cinecalidadResolver,
	embed69Resolver,
	playdedeResolver,
	riveEmbedResolver,
	riveStreamResolver,
	streamsitoResolver
} from "../scrapers/_index.js";

// Configuracion para TMDb de los resultados en español
const tmdb = new TMDb({ language: 'es-MX' });

// Funcion para obtener las fuentes de un proveedor específico
export const getSource = async (req, res, next) => {
	const { id: TMDb_ID, season, episode } = req.query;
	const { provider } = req.params;

	try {
		// Validación de TMDb_ID
		if (!TMDb_ID || isNaN(TMDb_ID)) {
			throw new BadRequestError("El parámetro 'id' del TMDb es requerido y debe ser un número válido.");
		}

		// Validación de season y episode
		if ((season && isNaN(season)) || (episode && isNaN(episode))) {
			throw new BadRequestError("Los parámetros 'season' y 'episode' deben ser números si están presentes.");
		}

		// Validación del proveedor
		if (!PROVIDERS.includes(provider)) {
			throw new BadRequestError(`El proveedor '${provider}' no es válido.`);
		}

		const type = (season && episode) ? 'tv' : 'movie';
		const { data } = await tmdb.getBasicInfo(TMDb_ID, type);

		// Validación de la respuesta de TMDb
		if (!data || !data.imdb_id) {
			throw new NotFoundError("No se pudo obtener la información de la Película/Serie.");
		}

		// Construcción de variables
		const variables = {
			tmdb_id: TMDb_ID,
			imdb_id: data.imdb_id,
			type,
			title: data.title,
			original_title: data.original_title,
			year: data.release_date?.split('-')[0],
			season,
			episode
		};

		// Definición de resolvers
		const resolvers = {
			cine24h: (params) => new cine24hResolver().getSources(params),
			cinecalidad: (params) => new cinecalidadResolver().getSources(params),
			embed69: (params) => new embed69Resolver().getSources(params),
			streamsito: (params) => new streamsitoResolver().getSources(params),
			riveEmbed: (params) => new riveEmbedResolver().getSources(params),
			riveStream: (params) => new riveStreamResolver().getSources(params),
			playdede: (params) => new playdedeResolver().getSources(params)
		};

		// Ejecución del resolver correspondiente
		try {
			const response = await resolvers[provider](variables);
			res.status(200).json(response);
		} catch (error) {
			throw new CustomError({
				message: `El proveedor '${provider}' falló al obtener las fuentes.`,
				code: 500
			});
		}
	} catch (error) {
		next(error);
	}
};