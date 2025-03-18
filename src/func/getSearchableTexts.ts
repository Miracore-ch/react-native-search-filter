import {$SearchableProperty} from "../Search.types";

export function getSearchableTexts<T>(
	item: T,
	property: $SearchableProperty<T>
): string[] {
	if (typeof item === 'string') {
		return [item];
	}

	if (item === null || item === undefined) {
		return [];
	}

	const result: string[] = [];

	if (typeof item === 'object') {
		// Extract values based on property keys
		for (const key of property.keys) {
			const value = (item as Record<any, any>)[key];

			if (value === null || value === undefined) {
				continue;
			}

			if (typeof value === 'string') {
				result.push(value);
			} else if (typeof value === 'function') {
				try {
					const functionResult = value.call(item);
					if (typeof functionResult === 'string') {
						result.push(functionResult);
					}
				} catch (e) {
					// Silently handle errors
				}
			} else if (typeof value === 'object') {
				if (value.toString && value.toString !== Object.prototype.toString) {
					result.push(value.toString());
				} else {
					try {
						result.push(JSON.stringify(value));
					} catch (e) {
						// Silently handle errors
					}
				}
			} else if (typeof value === 'number' || typeof value === 'boolean') {
				result.push(String(value));
			}
		}

		// Apply extractors if available
		if (property.extractors?.length) {
			for (const extractor of property.extractors) {
				try {
					const extractedValue = extractor(item);
					if (extractedValue) {
						result.push(extractedValue);
					}
				} catch (e) {
					// Silently handle errors
				}
			}
		}
	}

	return result.filter(Boolean);
}