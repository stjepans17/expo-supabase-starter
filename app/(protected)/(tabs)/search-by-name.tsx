import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '@/types';
import { spacingX, spacingY } from '@/constants/spacings';
import ExercisesList from '@/components/mine/ExercisesList';
import { fetchAllExercises } from '@/lib/exercise';
import { router } from 'expo-router';
import { useWorkout } from '@/context/WorkoutProvider';

const SearchExerciseScreen: React.FC = () => {
  const { dispatch } = useWorkout();

  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  // ── Load all exercises once ───────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAllExercises();
        setExercises(data);
      } catch (err) {
        console.error('Failed to load exercises', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── memoised filter ───────────────────────────────────────────
  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return exercises;
    const q = searchQuery.toLowerCase();
    return exercises.filter(
      ex =>
        ex.name.toLowerCase().includes(q) ||
        ex.description?.toLowerCase().includes(q),
    );
  }, [exercises, searchQuery]);

  // ── when user picks an exercise ───────────────────────────────
  const handleExercisePress = (exercise: Exercise) => {
    dispatch({ type: 'ADD_EXERCISE', exercise });
    router.push('/active-workout');                              
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.blur();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4600DE" />
          <Text style={styles.loadingText}>Loading exercises…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View
            style={[styles.searchInputContainer, isSearchFocused && styles.searchInputContainerFocused]}>
            <Ionicons
              name="search"
              size={20}
              color={isSearchFocused ? '#4600DE' : '#999'}
              style={styles.searchIcon}
            />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search exercises…"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {!!searchQuery && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {searchQuery ? `${filteredExercises.length} results` : `${exercises.length} exercises`}
          </Text>
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsWrapper}>
        {filteredExercises.length === 0 && searchQuery ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No exercises found</Text>
            <Text style={styles.emptyStateSubtitle}>Try another keyword</Text>
          </View>
        ) : (
          <ExercisesList exercises={filteredExercises} onExercisePress={handleExercisePress} />
        )}
      </View>
    </SafeAreaView>
  );
};

// ── styles (same as before) ─────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacingY._15 },
  loadingText: { fontSize: 16, color: '#666', fontFamily: 'Inter-Medium' },
  header: {
    backgroundColor: '#fff',
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
    paddingHorizontal: spacingX._15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: spacingX._10 },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._10,
  },
  searchInputContainerFocused: {
    backgroundColor: '#fff',
    borderColor: '#4600DE',
    shadowColor: '#4600DE',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchIcon: { marginRight: spacingX._10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333', fontFamily: 'Inter-Medium' },
  clearButton: { padding: spacingX._5 },
  cancelButton: { paddingVertical: spacingY._10, paddingHorizontal: spacingX._5 },
  cancelText: { fontSize: 16, color: '#4600DE', fontFamily: 'Inter-SemiBold' },
  resultsContainer: { marginTop: spacingY._15, paddingHorizontal: spacingX._5 },
  resultsText: { fontSize: 14, color: '#666', fontFamily: 'Inter-Medium' },
  resultsWrapper: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacingX._30 },
  emptyStateTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#333', marginTop: spacingY._15, marginBottom: spacingY._5 },
  emptyStateSubtitle: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#666', textAlign: 'center' },
});

export default SearchExerciseScreen;