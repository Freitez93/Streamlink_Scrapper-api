import * as textTools from '../utils/text.js';

/**
 * Mapping of server domains to their display names
 */
const defaultMap = {
	"yourupload": "YourUpload",
	"voe": "Voe",
	"vidmoly": "VidMoly",
	"streamplay": "StreamPlay",
	"powvideo": "PowVideo",
	"ok": "OKRu",
	"mp4upload": "MP4Upload",
	"goodstream": "GoodStream",
	"uqload": "UQLoad",
	"upstream": "UpStream"
};

// List of all domains that should be identified as StreamWish
const streamWish = new Set([
	'streamwish', 'ajmidyad', 'khadhnayad', 'yadmalik',
	'hayaatieadhab', 'kharabnahs', 'atabkhha', 'atabknha', 'atabknhk',
	'atabknhs', 'abkrzkr', 'abkrzkz', 'wishembed', 'mwish', 'strmwis',
	'awish', 'dwish', 'vidmoviesb', 'embedwish', 'cilootv', 'uqloads',
	'tuktukcinema', 'doodporn', 'ankrzkz', 'volvovideo', 'wishfast',
	'ankrznm', 'sfastwish', 'eghjrutf', 'eghzrutw', 'playembed',
	'egsyxurh', 'egtpgrvh', 'flaswish', 'obeywish', 'cdnwish',
	'javsw', 'cinemathek', 'trgsfjll', 'fsdcmo', 'anime4low',
	'mohahhda', 'ma2d', 'dancima', 'swhoi', 'gsfqzmqu',
	'jodwish', 'swdyu', 'strwish', 'asnwish', 'wishonly',
	'playerwish', 'katomen', 'hlswish', 'swishsrv',
	'iplayerhls', 'hlsflast', '4yftwvrdz7', 'ghbrisk',
	'eb8gfmjn71', 'cybervynx', 'edbrdl7pab'
]);

// List of all domains that should be identified as StreamTape
const streamTape = new Set([
	'streamtape', 'strtape', 'streamta', 'strcloud', 'strtpe',
	'scloud', 'stape', 'streamadblockplus', 'shavetape', 'streamadblocker',
	'tapewithadblock', 'adblocktape', 'antiadtape', 'tapeblocker',
	'streamnoads', 'tapeadvertisement', 'tapeadsenjoyer', 'watchadsontape'
]);

// List of all domains that should be identified as FileMoon
const fileMoon = new Set([
	'filemoon', 'cinegrab', 'moonmov', 'kerapoxy', 'furher',
	'1azayf9w', '81u6xl9d', 'smdfs40r', 'bf0skv', 'z1ekv717',
	'l1afav', '222i8x', '8mhlloqo', '96ar'
]);

// List of all domains that should be identified as FileLions
const fileLions = new Set([
	'filelions', 'ajmidyadfihayh', 'alhayabambi', 'moflix-stream',
	'azipcdn', 'mlions', 'alions', 'dlions', 'motvy55', 'fdewsdc',
	'lumiawatch', 'javplaya', 'fviplions', 'egsyxutd', 'javlion',
	'vidhide', 'vidhidepro', 'vidhidevip', 'vidhidepre', 'vidhidehub',
	'vidhideplus', 'techradar', 'anime7u', 'coolciima', 'gsfomqu',
	'katomen', 'dhtpre', '6sfkrspw4u', 'peytonepre', 'ryderjet',
	'e4xb5c2xnz', 'smoothpre', 'kinoger'
]);

// List of all domains that should be identified as DoodStream
const doodStream = new Set([
	'dood', 'doodstream', 'dooood', 'ds2play', 'doods',
	'ds2video', 'd0o0d', 'do0od', 'd0000d', 'd000d',
	'dooodster', 'vidply', 'all3do', 'do7go'
]);

// List of all domains that should be identified as VidGuard
const vidGuard = new Set([
	'vidguard', 'vgfplay', 'vgembed', 'moflix-stream',
	'v6embed', 'vid-guard', 'vembed', 'embedv', 'fslinks',
	'bembed', 'listeamed', 'gsfjzmqu', 'go-streamer', '6tnutl8knw',
	'dhmu4p2hkp'
]);

// List of all domains that should be identified as LuluStream
const luluStream = new Set(['lulustream', 'luluvdo', 'lulu', '732eg54de642sa']);

// List of all domains that should be identified as Waaw
const Waaw = new Set(['waaw', 'netu', 'hqq', 'doplay', 'younetu', 'stbnetu', 'ncdn22', 'oyohd']);

// Combine all domain sets into one map for efficient lookup
const combinedMap = new Map([
	...Object.entries(defaultMap),
	...[...streamWish].map(domain => [domain, 'StreamWish']),
	...[...streamTape].map(domain => [domain, 'StreamTape']),
	...[...fileMoon].map(domain => [domain, 'FileMoon']),
	...[...fileLions].map(domain => [domain, 'VidHide']),
	...[...doodStream].map(domain => [domain, 'DoodStream']),
	...[...vidGuard].map(domain => [domain, 'VidGuard']),
	...[...luluStream].map(domain => [domain, 'LuluStream']),
	...[...Waaw].map(domain => [domain, 'WaaW']),
]);

/**
 * Extracts and normalizes server name from a URL
 *
 * @param {string} baseURL - The URL to extract server name from
 * @returns {string} - The normalized server name
 */
export const getServerName = baseURL => {
	try {
		const host = new URL(baseURL).host;
		const hostSplit = host.split('.');
		const domain = hostSplit[0] === 'wwww' ? hostSplit[1] : hostSplit[0];

		// Check if domain is in the combined mapping
		if (combinedMap.has(domain)) {
			return combinedMap.get(domain);
		}

		// Default to title-cased host
		return textTools.toTitleCase(domain);
	} catch (error) {
		// Return 'Unknown' for invalid URLs or other errors
		return 'Unknown';
	}
};
