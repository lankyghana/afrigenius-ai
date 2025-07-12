import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Search as SearchIcon, Filter, BookOpen, Briefcase, Wrench, Globe } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { SearchBar } from '@/components/common/SearchBar';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { ApiService } from '@/services/api';
import { router } from 'expo-router';

interface SearchResult {
  id: string;
  type: 'explanation' | 'skill' | 'cultural' | 'business';
  title: string;
  content: string;
  module: string;
  relevance: number;
}

const moduleIcons = {
  'learn-smart': BookOpen,
  'hustle-smart': Briefcase,
  'learn-skill': Wrench,
  'culture-class': Globe,
};

const moduleColors = {
  'learn-smart': Colors.primary,
  'hustle-smart': Colors.secondary,
  'learn-skill': Colors.accent,
  'culture-class': Colors.info,
};

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [recentSearches, setRecentSearches] = useState([
    'Web Development',
    'Business Planning',
    'Yoruba Culture',
    'Digital Marketing',
    'Photography Skills',
  ]);

  const filters = [
    { id: 'all', name: 'All', icon: SearchIcon },
    { id: 'learn-smart', name: 'Learning', icon: BookOpen },
    { id: 'hustle-smart', name: 'Business', icon: Briefcase },
    { id: 'learn-skill', name: 'Skills', icon: Wrench },
    { id: 'culture-class', name: 'Culture', icon: Globe },
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setLoading(true);

    try {
      const response = await ApiService.searchContent(searchQuery, {
        module: selectedFilter === 'all' ? null : selectedFilter,
      });
      
      setResults(response.results);
      
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)];
        return updated.slice(0, 5);
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  const handleResultPress = (result: SearchResult) => {
    // Navigate to the appropriate module with the result
    switch (result.module) {
      case 'learn-smart':
        router.push('/(tabs)/');
        break;
      case 'hustle-smart':
        router.push('/(tabs)/hustle');
        break;
      case 'learn-skill':
        router.push('/(tabs)/skills');
        break;
      case 'culture-class':
        router.push('/(tabs)/culture');
        break;
    }
  };

  const getModuleIcon = (module: string) => {
    const IconComponent = moduleIcons[module] || SearchIcon;
    return <IconComponent size={20} color={moduleColors[module] || Colors.textSecondary} />;
  };

  return (
    <View style={styles.container}>
      <Header title="Search" />
      
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            placeholder="Search across all modules..."
            onSearch={handleSearch}
            onClear={handleClear}
            value={query}
            autoFocus={true}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersList}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.id && styles.selectedFilter,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <filter.icon 
                  size={16} 
                  color={selectedFilter === filter.id ? Colors.background : Colors.textSecondary} 
                />
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.selectedFilterText,
                ]}>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : results.length > 0 ? (
            <>
              <Text style={styles.resultsHeader}>
                Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </Text>
              
              {results.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={styles.resultCard}
                  onPress={() => handleResultPress(result)}
                >
                  <View style={styles.resultHeader}>
                    <View style={styles.resultModule}>
                      {getModuleIcon(result.module)}
                      <Text style={styles.moduleText}>
                        {filters.find(f => f.id === result.module)?.name || 'General'}
                      </Text>
                    </View>
                    
                    <View style={styles.relevanceScore}>
                      <Text style={styles.relevanceText}>
                        {Math.round(result.relevance * 100)}% match
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.resultTitle}>{result.title}</Text>
                  <Text style={styles.resultContent} numberOfLines={3}>
                    {result.content}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          ) : query ? (
            <View style={styles.noResultsContainer}>
              <SearchIcon size={48} color={Colors.textSecondary} />
              <Text style={styles.noResultsTitle}>No results found</Text>
              <Text style={styles.noResultsText}>
                Try adjusting your search terms or filters
              </Text>
            </View>
          ) : (
            <View style={styles.defaultState}>
              {/* Recent Searches */}
              <View style={styles.recentSection}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <View style={styles.recentSearches}>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recentSearchChip}
                      onPress={() => handleSearch(search)}
                    >
                      <Text style={styles.recentSearchText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Popular Topics */}
              <View style={styles.popularSection}>
                <Text style={styles.sectionTitle}>Popular Topics</Text>
                <View style={styles.popularTopics}>
                  {[
                    'JavaScript Programming',
                    'African Business Models',
                    'Traditional Crafts',
                    'Digital Marketing',
                    'Sustainable Agriculture',
                    'Mobile App Development',
                  ].map((topic, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.popularTopicCard}
                      onPress={() => handleSearch(topic)}
                    >
                      <Text style={styles.popularTopicText}>{topic}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Search Tips */}
              <View style={styles.tipsSection}>
                <Text style={styles.sectionTitle}>Search Tips</Text>
                <View style={styles.tips}>
                  <Text style={styles.tip}>💡 Use specific keywords for better results</Text>
                  <Text style={styles.tip}>🔍 Try different filters to narrow your search</Text>
                  <Text style={styles.tip}>📚 Search across all modules for comprehensive learning</Text>
                  <Text style={styles.tip}>🌍 Include cultural context for relevant examples</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  selectedFilter: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  selectedFilterText: {
    color: Colors.background,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  resultsHeader: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginVertical: 16,
  },
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultModule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moduleText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  relevanceScore: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  relevanceText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: Colors.success,
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 8,
  },
  resultContent: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  defaultState: {
    paddingVertical: 20,
  },
  recentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 16,
  },
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentSearchChip: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recentSearchText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  popularSection: {
    marginBottom: 32,
  },
  popularTopics: {
    gap: 12,
  },
  popularTopicCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  popularTopicText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tips: {
    gap: 12,
  },
  tip: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});