import { Exercise } from '@/types';
import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ExercisesListProps {
    exercises: Exercise[];
    onExercisePress?: (exercise: Exercise) => void;
}

const ExercisesList: React.FC<ExercisesListProps> = ({ exercises, onExercisePress }) => {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {exercises.map((exercise) => (
                <TouchableOpacity 
                    style={styles.item} 
                    key={exercise.id}
                    onPress={() => onExercisePress?.(exercise)} 
                >
                    <View style={styles.iconPlaceholder} />
                    <Text style={styles.itemText}>{exercise.name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        // paddingVertical: 10,
        // paddingHorizontal: 0,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%',
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
    },
});

export default ExercisesList;