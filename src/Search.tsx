import {$Search} from "./Search.types";
import {Platform, StyleSheet, TextInput, TextStyle, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import {useSearch} from "./useSearch";

export const Search = ({
	                       inputStyle,
	                       placeholder = "Search...",
	                       searchContainerStyle,
	                       clearIcon,
	                       searchIcon,
	                       data,
	                       setSearchData,
	                       onChangeText,
	                       minSearchLength = 2,
	                       complexOptions,
	                       searchByProperties,
	                       useComplexSearch = false,
	                       options,
	                       setRawSearchData
                       }: $Search) => {
	const [searchQuery, setSearchQuery] = useState('');

	const {handleChangeText: hookHandleChangeText} = useSearch({
		                                                           data,
		                                                           searchQuery,
		                                                           setSearchData,
		                                                           minSearchLength,
		                                                           searchByProperties,
		                                                           useComplexSearch,
		                                                           options,
		                                                           complexOptions,
		                                                           onChangeText,
		                                                           setRawSearchData
	                                                           });


	const handleChangeText = (text: string) => {
		setSearchQuery(text);
		hookHandleChangeText(text);
	};


	return (<View style={[styles.searchContainer, searchContainerStyle]}>
		{searchIcon && <View style={styles.searchIcon}>{searchIcon}</View>}
		<TextInput
			style={[styles.searchInput, Platform.OS === 'web' && {outline: 'none'} as TextStyle, inputStyle]}
			placeholder={placeholder}
			value={searchQuery}
			onChangeText={handleChangeText}
			underlineColorAndroid="transparent"
		/>
		{clearIcon && (<View style={styles.clearButtonContainer}>
			{searchQuery !== '' && (<TouchableOpacity
				onPress={() => handleChangeText('')}
				style={styles.clearButton}
				accessible={true}
				accessibilityRole="button"
				accessibilityLabel="Clear search">
				{clearIcon}
			</TouchableOpacity>)}
		</View>)}
	</View>);
};

const styles = StyleSheet.create({
	                                 searchInput:          {
		                                 flex:            1,
		                                 height:          "100%",
		                                 fontSize:        16,
		                                 paddingVertical: 8,
	                                 },
	                                 clearButtonContainer: {
		                                 width:          30,
		                                 height:         "100%",
		                                 justifyContent: 'center',
		                                 alignItems:     'center',
	                                 },
	                                 clearButton:          {
		                                 paddingLeft:    5,
		                                 justifyContent: 'center',
		                                 alignItems:     'center',
	                                 },
	                                 searchIcon:           {
		                                 marginRight:    8,
		                                 justifyContent: 'center',
		                                 alignItems:     'center',
	                                 },
	                                 searchContainer:      {
		                                 flexDirection:     'row',
		                                 backgroundColor:   'white',
		                                 paddingHorizontal: 15,
		                                 borderRadius:      8,
		                                 alignItems:        'center',
		                                 height:            46,
		                                 elevation:         1,
	                                 },
                                 });