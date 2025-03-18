import {normalizeText} from "./normalizeText";
import {levenshteinDistance} from "./levenshteinDistance";

export interface MatchDetails {
	matches: Array<{ index: number, length: number }>;
	bestMatch: string;
}

export interface RelevanceResult {
	relevance: number;
	matchDetails?: MatchDetails;
}

export function calculateRelevance(text: string, query: string): RelevanceResult {
	// Handle edge cases
	if (!text || !query) {
		return { relevance: 0 };
	}

	// Normalize inputs
	const normalizedText = normalizeText(text);
	const normalizedQuery = normalizeText(query);

	if (!normalizedText) {
		return { relevance: 0 };
	}

	// Exact match - highest relevance
	if (normalizedText === normalizedQuery) {
		return {
			relevance: 1,
			matchDetails: {
				matches: [{ index: 0, length: text.length }],
				bestMatch: text
			}
		};
	}

	// Substring match
	const index = normalizedText.indexOf(normalizedQuery);
	if (index !== -1) {
		// Calculate factors that influence relevance
		const positionFactor = 1 - (index / normalizedText.length) * 0.5;
		const lengthFactor = Math.min(1, normalizedQuery.length / normalizedText.length * 2);

		// Combine factors to get final relevance score
		const relevance = 0.5 + (positionFactor * lengthFactor * 0.5);

		return {
			relevance,
			matchDetails: {
				matches: [{ index, length: normalizedQuery.length }],
				bestMatch: text.substring(index, index + normalizedQuery.length)
			}
		};
	}

	// Word-based match
	const words = normalizedQuery.split(' ').filter(word => word.length > 2);
	if (words.length > 0) {
		const matches: Array<{ index: number, length: number }> = [];
		let maxWordRelevance = 0;
		let bestMatchWord = '';

		for (const word of words) {
			const wordIndex = normalizedText.indexOf(word);
			if (wordIndex !== -1) {
				matches.push({ index: wordIndex, length: word.length });

				// Calculate word-specific relevance
				const wordPositionFactor = 1 - (wordIndex / normalizedText.length) * 0.5;
				const wordLengthFactor = Math.min(1, word.length / normalizedText.length * 3);
				const wordRelevance = 0.3 + (wordPositionFactor * wordLengthFactor * 0.3);

				if (wordRelevance > maxWordRelevance) {
					maxWordRelevance = wordRelevance;
					bestMatchWord = text.substring(wordIndex, wordIndex + word.length);
				}
			}
		}

		if (matches.length > 0) {
			// Adjust relevance based on how many words were found
			const foundWordsRatio = matches.length / words.length;
			const relevance = maxWordRelevance * (0.7 + foundWordsRatio * 0.3);

			return {
				relevance,
				matchDetails: {
					matches,
					bestMatch: bestMatchWord
				}
			};
		}
	}

	// Fuzzy match using Levenshtein distance as a fallback
	const distance = levenshteinDistance(normalizedText, normalizedQuery);
	const maxLength = Math.max(normalizedText.length, normalizedQuery.length);

	// Normalize distance and convert to relevance
	const normalizedDistance = maxLength > 0 ? distance / maxLength : 1;
	const relevance = Math.max(0, 0.4 - (normalizedDistance * 0.4));

	return { relevance };
}
