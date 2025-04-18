// middleware/errorMiddleware.js
// Definición de tipos de errores personalizados
class BadRequestError extends Error {
	constructor(message) {
		super(message);
		this.name = 'BadRequestError';
		this.code = 400;
	}
}

class ForbiddenError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ForbiddenError';
		this.code = 403;
	}
}

class NotFoundError extends Error {
	constructor(message = 'Not Found') {
		super(message);
		this.name = 'NotFoundError';
		this.code = 404;
	}
}

class UnauthorizedError extends Error {
	constructor(message) {
		super(message);
		this.name = 'UnauthorizedError';
		this.code = 401;
	}
}

class ValidationError extends Error {
	constructor(errors) {
		super('Validation Error');
		this.name = 'ValidationError';
		this.code = 400;
		this.errors = errors;
	}
}

class CustomError extends Error {
	constructor(message, code = 500, type = 'InternalError') {
		super(message);
		this.name = type;
		this.code = code;
	}
}

// Middleware de manejo de errores
const errorMiddleware = (err, req, res, next) => {
	const statusCode = err.code || 500;
	const errorResponse = {
		code: statusCode,
		type: err.name,
		error: err.message,
	};

	if (err instanceof ValidationError) {
		errorResponse.error = err.errors;
	}

	res.status(statusCode).json(errorResponse);
};

// Exportar usando ES6
export default errorMiddleware;
export {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
	CustomError,
};