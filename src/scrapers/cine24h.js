import axios from "axios";
import { load } from "cheerio";
import * as _string from "../utils/text.js";
import { getServerName } from "../utils/serverMap.js";

class cine24hResolver {
	constructor() {
		this.DOMAIN = 'https://cine24h.online';
		this.responseData = {
			status: 'error',
			title: '',
			origin: '',
			source: [],
			subtitles: []
		};
	}

	async getSources({ type, title, year, season, episode } = {}) {
		const search = '/?s=' + _string.createSlug(title).replace(/-/g, '+');
		this.responseData.title = title

		try {
			const searchResult = await this.searchByTitle(this.DOMAIN + search);

			if (searchResult.length > 0) {
				for (const item of searchResult) {
					const isTitle = _string.isTitleEqual(item.title, title);
					const isYear = item.year.includes(year);

					if (isTitle && isYear) {
						const _search = {
							'movie': item.href,
							'tv': item.href.slice(0, -1).replace('serie/', 'episode/') + `-${season}x${episode}/`
						}[type];

						this.responseData.origin = _search;
						const { data: res } = await axios.get(_search);
						const $ = load(res);

						const elements = $('.TPlayerTb');
						for (let element of elements) {
							const html = $(element).html();
							let [_, embed, id, type] = html.match(/trembed=(\d).*trid=(\d+).*trtype=(\d)/);
							let src = `https://cine24h.online/?trembed=${embed}&trid=${id}&trtype=${type}`;

							try {
								const { data: serverUrl } = await axios.get(src);
								const $server = load(serverUrl);
								const iframe = $server('iframe').attr('src');

								this.responseData.source.push({
									server: getServerName(iframe),
									lang: item.lang,
									quality: item.quality,
									url: iframe,
								});
							} catch (error) {
								console.error(`Error fetching server URL: ${error.message}`);
							}
						}
					}
				}
			}

			if (this.responseData.source.length > 0) {
				this.responseData.status = 'success';
			}

			return this.responseData;
		} catch (error) {
			console.trace(error.message);
			return this.responseData;
		}
	}

	async searchByTitle(url) {
		try {
			const searchRes = await axios.get(url);
			const $ = load(searchRes.data);

			const searchResult = [];
			$('article').each((index, element) => {
				const $href = $(element).find('a').attr('href');
				const $lang = $href.includes('-sub/')
					? 'English Sub-Esp'
					: $href.includes('-es/') ? 'Spanish' : 'Latino';
				const $quality = $(element).find('span.sprite-CAM').hasClass('sprite-CAM')
					? 'CAMRip'
					: '720p';

				searchResult.push({
					title: $(element).find('h3.Title').text(),
					href: $href,
					year: $(element).find('span.Year').text(),
					lang: $lang,
					quality: $quality
				});
			});

			return searchResult;
		} catch (error) {
			return [];
		}
	}
}

export default cine24hResolver;