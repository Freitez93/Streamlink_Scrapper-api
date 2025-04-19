// Definir los proveedores como una constante
export const PROVIDERS = [
	"embed69",
	"streamsito",
	"playdede",
	"riveEmbed",
	"riveStream",
	"cinecalidad",
	"cine24h"
];

// Endpoint para obtener los proveedores disponibles
export const providers_list = (req, res) => {
	res.status(200).json({ providers: PROVIDERS });
};