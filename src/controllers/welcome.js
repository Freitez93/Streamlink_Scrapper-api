
// Ruta raíz para la API
export const welcome = (_req, res) => {
	res.status(200).json({
		status: "success",
		message: "Busca y extrae streams de videos de diferentes paginas web. 🎬🎉🎉",
		code: 200,
		additional_info: {
			server: "https://streamlink-scrapper.vercel.app/",
			github: "https://github.com/Freitez93/Streamlink_Scrapper-api",
		},
	});
};