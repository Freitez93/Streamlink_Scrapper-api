
/**
 * Index file for scrapers in the 'extractors' directory
 * Exports all scraper functions to be used throughout the application
 */

// Import all scrapers
import cine24hResolver from './cine24h.js'
import cinecalidadResolver from './cinecalidad.js';
import embed69Resolver from './embed69.js';
import playdedeResolver from './playdede.js';
import riveEmbedResolver from './riveEmbed.js';
import riveStreamResolver from './riveStream.js';
import streamsitoResolver from './streamsito.js';

// Export all scrapers
export {
	cine24hResolver,
	cinecalidadResolver,
	embed69Resolver,
	playdedeResolver,
	riveEmbedResolver,
	riveStreamResolver,
	streamsitoResolver
};