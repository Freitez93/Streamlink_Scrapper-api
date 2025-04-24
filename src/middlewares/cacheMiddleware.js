import NodeCache from 'node-cache';
import { config } from 'dotenv';

config();
const debug = process.env.CACHE_DEBUG === 'true';
const timer = parseInt(process.env.CACHE_TTL ?? 720, 10) * 60;  // Tiempo de expiración, 12h por defecto.
const cache = new NodeCache({
	stdTTL: timer,
	checkperiod: 600 // Intervalo de revisión de expiración (10 minutos)
});

const cacheMiddleware = (req, res, next) => {
	// Solo cacheamos peticiones GET
	if (req.method !== 'GET') return next();

	const key = req.originalUrl;
	const cachedResponse = cache.get(key);

	if (cachedResponse) {
		if (debug)
			console.log(`[ ${new Date().toLocaleString()} ] Cache found for: ${key}`);
		return res.send(cachedResponse);
	}

	// Capturamos el método original de respuesta
	const originalSend = res.send;
	res.send = (body) => {
		// Solo almacenamos en caché si el código de estado es 200 (OK)
		if (res.statusCode === 200) {
			cache.set(key, body);
		}
		originalSend.call(res, body);
	};

	next();
};

const cacheRoutes = (app) => {
	cache.on("expired", function (key, value) {
		if (debug) console.log(`[ ${new Date().toLocaleString()} ] Cache expired for: ${key}`);
	});

	// Rutas de administración del cache
	app.get('/api/cache/performance', (req, res) => {
		res.json(cache.getStats());
	});

	app.get('/api/cache/index', (req, res) => {
		res.json(cache.keys());
	});

	app.get('/api/cache/clear/:target?', (req, res) => {
		const { target } = req.params;
		if (target) {
			cache.del(target);
			res.json({ cleared: target });
		} else {
			cache.flushAll();
			res.json({ cleared: 'all' });
		}
	});

	// Middleware de cacheo
	app.use(cacheMiddleware);
};

export default cacheRoutes;