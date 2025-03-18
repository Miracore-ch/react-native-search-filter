# React Native Search Filter

A lightweight, highly customizable search component for React Native applications. Provides powerful text search capabilities with both simple and complex search algorithms.

![npm](https://img.shields.io/npm/v/@miracore-ch/react-native-search-filter)
[![license](https://img.shields.io/npm/l/@miracore-ch/react-native-highlight-text.svg)](https://www.npmjs.com/package/@miracore-ch/react-native-highlight-text)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## 🌟 Features

- 🔍 Simple and advanced search modes
- 🎯 Configurable search relevance scoring
- 🔤 Case-sensitive and insensitive options
- 🔄 Search by multiple properties
- 💎 Fuzzy search capability with Levenshtein distance
- 🎨 Fully customizable styling
- 📱 Works on all React Native platforms (iOS, Android, Web)
- 🧩 TypeScript support

## 📦 Installation

```bash
# Using npm
npm install @miracore-ch/react-native-search-filter

# Using yarn
yarn add @miracore-ch/react-native-search-filter
```

## 🚀 Basic Usage

```tsx
import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Search } from '@miracore-ch/react-native-search-filter';

const App = () => {
	const [data] = useState([
		                        { id: 1, name: 'John Doe', email: 'john@example.com' },
		                        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
		                        { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
	                        ]);

	const [filteredData, setFilteredData] = useState(data);

	return (
		<View style={{ padding: 20 }}>
			<Search
				data={data}
				setSearchData={setFilteredData}
				searchByProperties={{
					keys: ['name', 'email']
				}}
				placeholder="Search users..."
			/>
			<FlatList
				data={filteredData}
				renderItem={({item}) => (
					<View style={{
						padding: 16,
						borderBottomWidth: 1,
						borderBottomColor: '#eee',
						width: '100%'
					}}>
						<Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.id}</Text>
						<Text style={{fontSize: 16, color: '#007BFF'}}>{item.name}</Text>
						<Text style={{marginTop: 4, color: '#555'}}>{item.email}</Text>
					</View>
				)}
				keyExtractor={item => item.id.toString()}
			/>
		</View>
	);
};

export default App;
```

## 🔍 Advanced Usage

### Complex Search with Relevance Scoring

```tsx
import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Search } from '@miracore-ch/react-native-search-filter';
import { MaterialIcons } from '@expo/vector-icons'; // or your preferred icon library

class Product {
	constructor(public id: string, public title: string, public description: string, private _price: number) {}

	getDisplayInfo(): string {
		return `${this.title} - $${this._price}: ${this.description}`;
	}
}

const productsArray = [
	new Product("p1", "Laptop Pro X9", "High-performance laptop with 16GB RAM and 1TB SSD storage. Perfect for professionals.", 999),
	new Product("p2", "Smartphone Ultra", "Latest smartphone with 5G capability and stunning camera quality.", 499),
	new Product("p3", "Wireless Headphones", "Noise-cancelling bluetooth headphones with long battery life.", 129)
];

export default function AdvancedSearch() {
	const [filteredData, setFilteredData] = useState(productsArray);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Search
				data={productsArray}
				searchByProperties={{
					keys: ['title', 'description', 'getDisplayInfo']
				}}
                setSearchData={results => setFilteredData(results)}
				searchIcon={<MaterialIcons name="search" size={20} color="#999"/>}
				clearIcon={<MaterialIcons name="close" size={20} color="#999"/>}
				useComplexSearch={true}
				complexOptions={{
					minRelevance: 0.005,
					sortByRelevance: true,
					limit: 0
				}}
			/>

			<FlatList
				data={filteredData}
				renderItem={({item}) => (
					<View style={{
						padding: 16,
						borderBottomWidth: 1,
						borderBottomColor: '#eee',
						width: '100%'
					}}>
						<Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.title}</Text>
						<Text style={{fontSize: 16, color: '#007BFF'}}>{item.getDisplayInfo()}</Text>
						<Text style={{marginTop: 4, color: '#555'}}>{item.description}</Text>
					</View>
				)}
				keyExtractor={item => item.id}
			/>
		</View>
	);
}
```

### Using Raw Search Results with Complex Search

When you need access to relevance scores and match details, you can use both `setSearchData` and `setRawSearchData`:

```tsx
import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Search } from '@miracore-ch/react-native-search-filter';
import type { $SearchResult } from '@miracore-ch/react-native-search-filter';

interface Product {
  id: string;
  name: string;
  description: string;
}

const App = () => {
  const products = [
    { id: '1', name: 'Laptop', description: 'Powerful laptop for professionals' },
    { id: '2', name: 'Smartphone', description: 'Latest smartphone with great camera' },
    { id: '3', name: 'Headphones', description: 'Noise-cancelling wireless headphones' },
  ];

  // Regular filtered data for the list
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  // Raw search results with match details and scores
  const [rawResults, setRawResults] = useState<$SearchResult<Product>[]>([]);
  
  return (
    <View style={{ padding: 20 }}>
      <Search
        data={products}
        searchByProperties={{
          keys: ['name', 'description']
        }}
        setSearchData={setFilteredProducts}
        setRawSearchData={setRawResults}
        useComplexSearch={true} // Enable complex search for relevance scoring
      />
      
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => {
          // Find corresponding raw result to access score and match details
          const rawResult = rawResults.find(r => r.item.id === item.id);
          
          return (
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>{item.description}</Text>
              
              {/* Display relevance info if available */}
              {rawResult && (
                <>
                  <Text style={{ color: 'green' }}>
                    Relevance: {(rawResult.relevanceScore * 100).toFixed(2)}%
                  </Text>
                  {rawResult.bestResult && (
                    <Text style={{ color: 'gray' }}>
                      Best Match: {rawResult.bestResult.text}
                    </Text>
                  )}
                </>
              )}
            </View>
          );
        }}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default App;
```

## 🧩 Using the Standalone Search Logic

You can use the search logic independently from the UI component, allowing you to create your own custom search UI:

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { useSearch } from '@miracore-ch/react-native-search-filter';

const CustomSearchImplementation = () => {
  // Sample data
  const data = [
    { id: 1, name: 'Apple', category: 'Fruit' },
    { id: 2, name: 'Banana', category: 'Fruit' },
    { id: 3, name: 'Carrot', category: 'Vegetable' },
    // ...more data
  ];

  // State for search results
  const [searchResults, setSearchResults] = useState(data);
  // State for search query, updated by your custom component
  const [searchQuery, setSearchQuery] = useState('');

  // Use the useSearch hook
  useSearch({
    data,
    searchQuery,
    setSearchData: setSearchResults,
    searchByProperties: {
	    keys: ['name', 'category']
    },
    minSearchLength: 2,
    options: {
      caseSensitive: false,
      limit: 0
    }
  });

  return (
    <View>
      {/* Your custom search input */}
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search fruits and vegetables..."
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10
        }}
      />
      
      {/* Display search results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.name} - {item.category}</Text>
        )}
      />
    </View>
  );
};

export default CustomSearchImplementation;
```

## 📋 API Reference

### Search Component Props (`$Search`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array<T>` | required | The data array to search through |
| `setSearchData` | `(filteredData: Array<T>) => void` | required | Function to receive filtered data as a regular array |
| `setRawSearchData` | `(rawResults: $SearchResult<T>[]) => void` | optional | Additional callback function to receive raw search results with relevance scoring and match details |
| `searchByProperties` | `$SearchableProperty<T>` | required | Configuration for searchable properties |
| `inputStyle` | `TextStyle` | undefined | Custom styles for the search input |
| `searchContainerStyle` | `ViewStyle` | undefined | Custom styles for the search container |
| `placeholder` | `string` | "Search..." | Placeholder text for the search input |
| `clearIcon` | `ReactElement \| null` | null | Icon to clear the search input |
| `searchIcon` | `ReactElement \| null` | null | Icon displayed at the start of the search input |
| `onChangeText` | `(text: string) => void` | undefined | Callback when input text changes |
| `minSearchLength` | `number` | 2 | Minimum text length to start searching |
| `limit` | `number` | 0 | Limit the number of results (0 = no limit) |
| `useComplexSearch` | `boolean` | false | Use complex search algorithm with relevance scoring |
| `options` | `$EasySearchOptionsProps` | `{ caseSensitive: false, limit: 0 }` | Options for basic search |
| `complexOptions` | `$ComplexSearchOptionsProps` | `{ sortByRelevance: true, minRelevance: 0.2, limit: 0 }` | Options for complex search |

### useSearch Hook Props (`$UseSearch`)

| Prop                 | Type                                    | Default                                                    | Description                                         |
|----------------------|-----------------------------------------|------------------------------------------------------------|-----------------------------------------------------|
| `data`               | `Array<T>`                              | required                                                   | The data array to search through                    |
| `searchQuery`        | `string`                                | required                                                   | The current search query                            |
| `setSearchData` | `(filteredData: Array<T>) => void` | required                                                   | Function to receive filtered data as a regular array |
| `setRawSearchData` | `(rawResults: $SearchResult<T>[]) => void` | optional                                                   | Additional callback function to receive raw search results with relevance scoring and match details |
| `searchByProperties` | `$SearchableProperty<T>`                | required                                                   | Configuration for searchable properties             |
| `minSearchLength`    | `number`                                | 2                                                          | Minimum text length to start searching              |
| `useComplexSearch`   | `boolean`                               | false                                                      | Use complex search algorithm with relevance scoring |
| `options`            | `$EasySearchOptionsProps`               | `{ caseSensitive: false, limit: 0 }`                       | Options for basic search                            |
| `complexOptions`     | `$ComplexSearchOptionsProps`            | `{ sortByRelevance: true, minRelevance: 0.00, limit: 0 }` | Options for complex search                          |
| `onChangeText`       | `(text: string) => void`                | undefined                                                  | Callback when input text changes                    |

### Types

```typescript
// Search options for basic search
export type $EasySearchOptionsProps = {
	caseSensitive?: boolean;
	limit?: number;
};
// Complex search options
export type $ComplexSearchOptionsProps = {
	minRelevance?: number;
	sortByRelevance?: boolean;
	limit?: number;
};
// Search property configuration
type $SearchableProperty<T> = {
  keys: T extends string ? [] : Array<keyof T>; // Property keys (object key, class property, class function) to search
  extractors?: Array<(item: T) => string>; // Custom extractors for complex data
};

// Search result for complex search
type $SearchResult<T> = {
  item: T; // The original item
  results: $SearchItemResult[]; // All search matches
  bestResult: $SearchItemResult; // Best matching result
  relevanceScore: number; // Overall relevance score
};

type $SearchItemResult = {
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
```

## 🔎 Search Algorithms

### Basic Search

Uses a simple `includes()` method to find matches in the specified properties. Fast and efficient for simple filtering needs.

### Complex Search

Employs a sophisticated algorithm that:

1. Normalizes text (removing accents, case sensitivity)
2. Calculates relevance based on:
    - Exact matches
    - Substring position and length
    - Word-level matches
    - Levenshtein distance (for fuzzy matching)
3. Scores and ranks results by relevance
4. Filters by minimum relevance threshold

## 🧰 Working with Raw Search Results

You can access both filtered data and detailed raw search results simultaneously using the dedicated callbacks:

```typescript
// Example of using raw search results
import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Search } from '@miracore-ch/react-native-search-filter';
import type { $SearchResult } from '@miracore-ch/react-native-search-filter';

interface Product {
  id: string;
  name: string;
  description: string;
}

const App = () => {
  const products = [
    { id: '1', name: 'Laptop', description: 'Powerful laptop for professionals' },
    { id: '2', name: 'Smartphone', description: 'Latest smartphone with great camera' },
    { id: '3', name: 'Headphones', description: 'Noise-cancelling wireless headphones' },
  ];

  // Regular filtered data
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  // Raw search results with detailed match information
  const [rawResults, setRawResults] = useState<$SearchResult<Product>[]>([]);
  
  // Track if we have search results to show additional UI elements
  const [hasSearchResults, setHasSearchResults] = useState(false);
  
  return (
    <View style={{ padding: 20 }}>
      <Search
        data={products}
        searchByProperties={{
          keys: ['name', 'description']
        }}
        setSearchData={(filtered) => {
          setFilteredProducts(filtered);
          setHasSearchResults(filtered.length < products.length);
        }}
        setRawSearchData={setRawResults}
        useComplexSearch={true}
      />
      
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => {
          // Find the raw result for this item to display relevance info
          const rawResult = rawResults.find(r => r.item.id === item.id);
          
          return (
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>{item.description}</Text>
              
              {/* Only show relevance info when using complex search and we have results */}
              {hasSearchResults && rawResult && (
                <View>
                  <Text style={{ color: 'green' }}>
                    Relevance: {(rawResult.relevanceScore * 100).toFixed(2)}%
                  </Text>
                  <Text style={{ color: 'gray' }}>
                    Best Match: {rawResult.bestResult?.text}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default App;
```

This is particularly useful for:

- Highlighting matched text in the UI
- Building custom relevance indicators
- Debugging search results
- Creating advanced filtering based on match details

## 🛠️ Customization

### 🎨 Styling Example

```tsx
<Search
  searchContainerStyle={{
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 50,
    paddingHorizontal: 20,
  }}
  inputStyle={{
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  }}
  placeholder="Custom styled search..."
  // Add your icons here
/>
```

### Custom Property Extractors

For complex data structures or computed properties:

```tsx
const fullNameExtractor = (item) => `${item.firstName} ${item.lastName}`;
const metadataExtractor = (item) => JSON.stringify(item.metadata);

<Search
  searchByProperties={{
    keys: ['email', 'username'],
    extractors: [fullNameExtractor, metadataExtractor]
  }}
  // Other props
/>
```

## 💯 Performance Tips

- Use basic search mode for large data sets when complex relevance scoring isn't needed
- Set an appropriate `minSearchLength` to prevent excessive filtering for short inputs
- Apply a reasonable `limit` in options or complexOptions when dealing with large data sets
- Use the complex search mode with caution on very large datasets (1000+ items) as it's more CPU intensive

## 🎮 Platform Support
| Platform | Support |
|----------|---------|
| iOS      | ✅      |
| Android  | ✅      |
| Web      | ✅      |

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.