import express from "express";
import securityMiddleware from "./middlewares/securityMiddleware.js";
import cacheMiddleware from "./middlewares/cacheMiddleware.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

// Importacion de las rutas de Sources
import getSource_Router from "./routes/getSource.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
securityMiddleware(app);

// Middlewares de cache
cacheMiddleware(app);

// Informacion en consola de cada request
app.use((req, res, next) => {
	console.log(`[ ${new Date().toLocaleString()} ] ${req.method} ${req.url}`);
	next();
});

// Ruta raíz para la API
app.get("/api", (_req, res) => {
	res.send({
		status: "success",
		message: "Busca y extrae streams de videos de diferentes paginas web. 🎬🎉🎉",
		code: 200,
		additional_info: {
			server: "https://MultiScraping-Api.vercel.app/",
			github: "https://github.com/Freitez93/MultiScraping-api",
		},
	});
});

app.use("/api/getSource", getSource_Router);

// Middleware de errores
app.use(errorMiddleware);

app.listen(PORT, () => {
	console.log(`Servidor iniciado en el puerto http://localhost:${PORT}/api listo para trabajar :)`);
});
