import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';

config()
const windowMsTime = (process.env.RATE_LIMIT_WINDOW_MS || 15) * 60 * 1000;	// 15 minutos
const maxRequests = process.env.MAX_REQUESTS || 100; 						// Límite de solicitudes por IP

const securityMiddleware = (app) => {
	// Protección contra vulnerabilidades comunes
	app.use(helmet());

	// Configuración CORS
	app.use(cors({
		//origin: ['https://tu-dominio.com', 'http://localhost:3000'],
		methods: ['GET'],
		maxAge: 86400
	}));

	// Limitación de solicitudes
	const limiter = rateLimit({
		windowMs: windowMsTime,
		max: maxRequests
	});

	app.use(limiter);
};

export default securityMiddleware;