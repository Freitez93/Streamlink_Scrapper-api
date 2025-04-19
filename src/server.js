import express from "express";
import securityMiddleware from "./middlewares/securityMiddleware.js";
import cacheMiddleware from "./middlewares/cacheMiddleware.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

// Importacion de las rutas
import router from "./routes/route.js";

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

// Todas las rutas
app.use(router)

// Middleware de errores
app.use(errorMiddleware);

app.listen(PORT, () => {
	console.log(`Servidor iniciado en el puerto http://localhost:${PORT}/api listo para trabajar :)`);
});
