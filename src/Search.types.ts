import {TextStyle, ViewStyle} from "react-native";
import {ReactElement} from "react";

export type $Searchable<T> = Array<T>;

export type $SearchableProperty<T> = {
	keys: T extends string ? [] : Array<keyof T>;
	extractors?: Array<(item: T) => string>;
};

export type $SearchItemResult = {
	text: string;
	relevance: number;
	matchDetails?: {
		matches: Array<{
			index: number,
			length: number
		}>;
		bestMatch: string;
	};
}

export type $SearchResult<T> = {
	item: T;
	results: $SearchItemResult[];
	bestResult: $SearchItemResult | null;
	relevanceScore: number;
}

export type $ComplexSearchOptionsProps = {
	minRelevance?: number;
	limit?: number;
	sortByRelevance?: boolean;
}

export type $ComplexSearchOptions = {
	minRelevance: number;
	limit: number;
	sortByRelevance: boolean;
}

export type $EasySearchOptionsProps = {
	caseSensitive?: boolean;
	limit?: number;
}

export type $EasySearchOptions = {
	caseSensitive: boolean;
	limit: number;
}

export type $ComplexSearch<T> = {
	data: $Searchable<T>,
	query: string,
	property: $SearchableProperty<T>,
	options: $ComplexSearchOptions,
}

export type $EasySearch<T> = {
	data: $Searchable<T>,
	query: string,
	property: $SearchableProperty<T>,
	options: $EasySearchOptions
}

export type $UseSearch<T = any> = {
	searchByProperties: $SearchableProperty<T>;
	data: T[];
	setSearchData: (filteredData: T[]) => void;
	setRawSearchData?: (filteredData: $SearchResult<T>[]) => void;
	minSearchLength?: number;
	options?: $EasySearchOptionsProps
	complexOptions?: $ComplexSearchOptionsProps;
	useComplexSearch?: boolean
	searchQuery: string;
	onChangeText?: (text: string) => void;
}

export type $Search<T = any> = Omit<$UseSearch<T>, "searchQuery"> & {
	inputStyle?: TextStyle;
	searchContainerStyle?: ViewStyle;
	placeholder?: string;
	clearIcon?: ReactElement | null;
	searchIcon?: ReactElement | null;

	// onChangeText?: (text: string) => void;
	// searchByProperties: $SearchableProperty<T>;
	// data: T[];
	// setSearchData: (filteredData: T[]) => void;
	// minSearchLength?: number;
	// options?: $EasySearchOptions
	// complexOptions?: $ComplexSearchOptions;
	// useComplexSearch?: boolean
}