# Streamlink Scrapper API

## Descripción

Streamlink Scrapper API es un servicio que busca y extrae streams de videos de diferentes páginas web. Este proyecto facilita la obtención de enlaces directos a contenido multimedia de diversas fuentes en línea.

## Características

-   Extracción de streams de video de múltiples sitios web
-   API RESTful fácil de usar
-   Sistema de caché para mejorar el rendimiento
-   Middleware de seguridad incorporado
-   Manejo de errores robusto

## Tecnologías Utilizadas

-   Node.js
-   Express
-   Bun (runtime)
-   Axios
-   Cheerio (para web scraping)
-   NodeCache

## Requisitos Previos

-   [Bun](https://bun.sh/) (para ejecutar el proyecto)
-   Node.js (versión recomendada: 14 o superior)

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/Streamlink_Scrapper-api.git
cd Streamlink_Scrapper-api
```

2. Instalar dependencias:

```bash
bun install
```

3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
PORT=3000
DEBUG=true
```

## Uso

### Desarrollo

Para ejecutar el proyecto en modo desarrollo con recarga automática:

```bash
bun start:dev
```

### Producción

Para ejecutar el proyecto en modo producción:

```bash
bun start
```

## Endpoints

### Ruta Principal

-   **GET /api**
    -   Descripción: Información general sobre la API
    -   Respuesta:
    ```json
    {
    	"status": "success",
    	"message": "Busca y extrae streams de videos de diferentes paginas web. 🎬🎉🎉",
    	"code": 200,
    	"additional_info": {
    		"github": "https://github.com/Freitez93/StreamLink_Scrapper-API"
    	}
    }
    ```

### Obtener Fuente de Video

-   **GET /api/getSource/providers**
    -   Descripción: Lista de proveedores de streaming disponibles
    -   Respuesta:
    ```json
    	{
        	"providers": ["embed69", "streamsito", "playdede"...]
        }
    ```

### Obtener Fuente de Video

-   **GET /api/getSource/:provider**
    -   Descripción: Extrae enlaces de stream de una URL proporcionada
    -   Parámetros:
        -   `id`: identificador de TheMovieDateBase (requerido)
        -   `season`: de ser una serie agregar la temporada.
        -   `episode`: de ser una serie agregar el episodio.
    -   Respuesta de éxito:
    ```json
    {
    	"status": "success",
    	"title": "Una película de Minecraft",
    	"origin": "https://cine24h.online/movie/una-pelicula-de-minecraft-eng/",
    	"source": [
    		{
    			"server": "WaaW",
    			"lang": "Latino",
    			"url": "https://hqq.to/e/example"
    		},
    		...
    	],
    	"subtitles": []
    }
    ```

## Estructura del Proyecto

```

├── src
│ ├── middlewares
│ │ ├── cacheMiddleware.js
│ │ ├── errorMiddleware.js
│ │ └── securityMiddleware.js
│ ├── scrapers
│ ├── routes
│ │ └── getSource.routes.js
│ ├── utils
│ └── server.js
├── index.js
├── package.json
└── vercel.json

```

## Despliegue

Este proyecto está configurado para ser desplegado en Vercel. El archivo `vercel.json` incluye la configuración necesaria para el despliegue.

## Manejo de Errores

La API incluye un sistema de manejo de errores que proporciona respuestas consistentes:

```json
{
	"message": "Mensaje de error específico",
	"status": "Error",
	"code": 404
}
```

Los códigos de error posibles son:

-   400: Error en los parámetros de la solicitud
-   404: Recurso no encontrado
-   500: Error interno del servidor

## Contribuciones

...

## Licencia

...
