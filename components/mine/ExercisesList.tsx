import { Exercise } from '@/types';
import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ExercisesListProps {
  exercises: Exercise[];
  onExercisePress?: (exercise: Exercise) => void;
}

const ExercisesList: React.FC<ExercisesListProps> = ({ exercises, onExercisePress }) => {
  const truncate = (str: string, n: number) =>
    str.length > n ? `${str.slice(0, n)}…` : str;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      alwaysBounceHorizontal={false}
      overScrollMode="never"
      bounces={false}
    >
      {exercises.map(exercise => (
        <TouchableOpacity
          key={exercise.id.toString()}
          style={styles.item}
          onPress={() => onExercisePress?.(exercise)}
          activeOpacity={0.7}
        >
          <View style={styles.iconPlaceholder} />
          <Text style={styles.itemText}>
            {truncate(exercise.name, 30)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    // keep your previous paddings here if any
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignSelf: 'stretch',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginRight: 16,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flexShrink: 1,  // prevent overflow
  },
});

export default ExercisesList;
