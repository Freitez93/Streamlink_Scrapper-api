// objectTools.js

export const levenshteinDistance = (a, b) => {
	const an = a ? a.length : 0;
	const bn = b ? b.length : 0;
	if (an === 0) return bn;
	if (bn === 0) return an;

	const matrix = [];

	for (let i = 0; i <= bn; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= an; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= bn; i++) {
		for (let j = 1; j <= an; j++) {
			const cost = (a[j - 1] === b[i - 1]) ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1,
				matrix[i][j - 1] + 1,
				matrix[i - 1][j - 1] + cost
			);
		}
	}

	return matrix[bn][an];
}