// WorkoutCompleted.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WorkoutCompletedProps {
  workoutName: string;
  duration: string;       // e.g. "54:24"
  exercises: number;      // e.g. 16
  completedPercent: number; // e.g. 77
  onShare: () => void;
  onContinue: () => void;
}

export const WorkoutCompleted: React.FC<WorkoutCompletedProps> = ({
  workoutName,
  duration,
  exercises,
  completedPercent,
  onShare,
  onContinue,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti / Checkmark */}
      <View style={styles.header}>
        {/* You could swap this for an SVG confetti animation */}
        <MaterialIcons name="check-circle" size={72} color="#4600DE" />
      </View>

      {/* Titles */}
      <Text style={styles.title}>Workout Completed</Text>
      <Text style={styles.subtitle}>You crushed it!</Text>

      {/* Workout name */}
      <Text style={styles.workoutName}>{workoutName}</Text>

      {/* Stats cards */}
      <View style={styles.statsRow}>
        {[
          { icon: 'access-time', value: duration, label: 'Duration' },
          { icon: 'fitness-center', value: exercises.toString(), label: 'Exercises' },
          { icon: 'donut-large', value: `${completedPercent}%`, label: 'Completed' },
        ].map(({ icon, value, label }) => (
          <View key={label} style={styles.statCard}>
            <MaterialIcons name={icon} size={28} color="#4600DE" />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Encouragement */}
      <Text style={styles.footerText}>Keep the momentum going!</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={onShare}>
        <Text style={styles.primaryButtonText}>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.outlineButton} onPress={onContinue}>
        <Text style={styles.outlineButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const CARD_WIDTH = (SCREEN_WIDTH - 64) / 3; // 16px padding each side + 16px between

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#4600DE',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#4600DE',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#4600DE',
    fontSize: 16,
    fontWeight: '600',
  },
});
