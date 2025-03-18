import {$SearchableProperty, $SearchItemResult} from "../../Search.types";
import {getSearchableTexts} from "../getSearchableTexts";
import {calculateRelevance} from "./calculateRelevance";

export function getSearchableTextWithRelevance<T>(
	item: T,
	query: string,
	property: $SearchableProperty<T>
): $SearchItemResult[] {
	if (!query) {
		return [];
	}

	const texts = getSearchableTexts(item, property);

	// Calculate relevance for each extracted text
	return texts.map(text => {
		const result = calculateRelevance(text, query);
		return {
			text,
			relevance: result.relevance,
			matchDetails: result.matchDetails
		};
	});
}