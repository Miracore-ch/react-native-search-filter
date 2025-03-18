import {$EasySearch} from "../Search.types";
import {getSearchableTexts} from "./getSearchableTexts";

export function search<T>({
	                          data,
	                          query,
	                          property,
	                          options
                          }: $EasySearch<T>): Array<T> {
	if (!query) {
		return data;
	}

	const normalizedQuery = options.caseSensitive
	                        ? query
	                        : query.toLowerCase();

	return data.filter(item => {
		const texts = getSearchableTexts(item, property);

		if (texts.length === 0) {
			return false;
		}

		return texts.some(text => {
			const normalizedText = options.caseSensitive
			                       ? text
			                       : text.toLowerCase();

			return normalizedText.includes(normalizedQuery);
		});
	});
}
