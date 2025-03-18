import {getSearchableTextWithRelevance} from "./getSearchableTextWithRelevance";
import {$ComplexSearch, $SearchResult} from "../../Search.types";

export function complexSearch<T>({data, query, property, options}: $ComplexSearch<T>): Array<$SearchResult<T>> {
	const {
		      minRelevance,
		      limit,
		      sortByRelevance
	      } = options;

	// Use filter directly instead of map + filter(Boolean)
	const results = data
	.reduce<Array<$SearchResult<T>>>((acc, item) => {
		const searchResults = getSearchableTextWithRelevance(item, query, property);
		const filteredResults = searchResults.filter(r => r.relevance >= minRelevance);

		if (filteredResults.length === 0) {
			return acc;
		}

		// Find the best result
		const bestResult = filteredResults.reduce(
			(best, current) => current.relevance > best.relevance ? current : best,
			filteredResults[0]
		);

		// Calculate weighted relevance score
		const sortedResults = [...filteredResults].sort((a, b) => b.relevance - a.relevance);
		const topResults = sortedResults.slice(0, 3);

		let relevanceScore = 0;
		let weightSum = 0;

		topResults.forEach((result, index) => {
			// Weight: 1, 1/2, 1/3
			const weight = 1 / (index + 1);
			relevanceScore += result.relevance * weight;
			weightSum += weight;
		});

		relevanceScore = weightSum > 0 ? relevanceScore / weightSum : 0;

		acc.push({
			         item,
			         results: filteredResults,
			         bestResult,
			         relevanceScore
		         });

		return acc;
	}, []);

	// Sort and limit results
	let finalResults = sortByRelevance
	                   ? [...results].sort((a, b) => b.relevanceScore - a.relevanceScore)
	                   : results;

	if (limit && limit > 0) {
		finalResults = finalResults.slice(0, limit);
	}

	return finalResults;
}
