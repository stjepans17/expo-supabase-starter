import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

interface WorkoutListProps {
    workouts: string[];
}

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts }) => {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {workouts.map((workout, index) => (
                <View style={styles.item} key={index}>
                    <View style={styles.iconPlaceholder} />
                    <Text style={styles.itemText}>{workout}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 10,
        paddingHorizontal: 0,
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

export default WorkoutList;