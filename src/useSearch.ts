import {useCallback, useEffect, useMemo} from "react";
import {complexSearch} from "./func/complexSearch/complexSearch";
import {search} from "./func/search";
import {$SearchResult, $UseSearch} from "./Search.types";


export const useSearch = <T>({
	                             data,
	                             searchQuery,
	                             setSearchData,
	                             minSearchLength = 2,
	                             searchByProperties,
	                             useComplexSearch = false,
	                             options,
	                             complexOptions,
	                             onChangeText,
	                             setRawSearchData
                             }: $UseSearch<T>) => {

	const handleChangeText = useCallback((text: string) => {
		onChangeText?.(text);
	}, [onChangeText]);

	const searchOptions = useMemo(() => ({
		caseSensitive: options?.caseSensitive || false,
		limit:         options?.limit || 0,
	}), [options?.caseSensitive, options?.limit]);

	const complexSearchOptions = useMemo(() => ({
		limit:           complexOptions?.limit || 0,
		minRelevance:    complexOptions?.minRelevance || 0.00,
		sortByRelevance: complexOptions?.sortByRelevance || true
	}), [complexOptions?.limit, complexOptions?.minRelevance, complexOptions?.sortByRelevance]);

	const searchResult = useMemo((): {raw: $SearchResult<T>[], data: T[]} => {
		// Early return if search query doesn't meet minimum requirements
		if (!searchQuery || searchQuery.length < Math.max(1, minSearchLength)) {
			return {
				raw: data.map(item => ({item, results: [], bestResult: null, relevanceScore: 1})) as $SearchResult<T>[],
				data: data
			}

		}

		if (useComplexSearch) {
			const searchResult =  complexSearch({
				                         data,
				                         query:    searchQuery,
				                         property: searchByProperties,
				                         options:  complexSearchOptions
			                         })
			return {
				raw:searchResult as $SearchResult<T>[],
				data:searchResult.map(result => result.item) as T[]
			}
		}

		return {
			raw: [],
			data: search({
				       data,
				       query:    searchQuery,
				       property: searchByProperties,
				       options:  searchOptions
			       })
		};
	}, [searchQuery]);

	useEffect(() => {
		setSearchData(searchResult.data);
		setRawSearchData?.(searchResult.raw);
	}, [searchResult, setSearchData]);



	return {
		searchResult,
		handleChangeText
	};
};