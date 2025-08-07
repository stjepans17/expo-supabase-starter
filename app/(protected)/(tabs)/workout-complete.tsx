// app/(protected)/(tabs)/completed/[workout_id].tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { supabase } from '@/config/supabase';
import { spacingY } from '@/constants/spacings';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function WorkoutCompletedPage() {
  const { workout_id } = useLocalSearchParams<{ workout_id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [workoutName, setWorkoutName] = useState('');
  const [duration, setDuration] = useState('0:00');
  const [exerciseCount, setExerciseCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!workout_id) return;

    (async () => {
      setLoading(true);
      try {
        // Fetch workout info...
        const { data: workout, error: wErr } = await supabase
          .from('workout')
          .select('name, duration_seconds')
          .eq('id', workout_id)
          .maybeSingle();
        if (wErr) throw wErr;
        if (!workout) throw new Error('Workout not found');

        setWorkoutName(workout.name || 'Unnamed Workout');
        const total = workout.duration_seconds || 0;
        const mm = String(Math.floor(total / 60)).padStart(2, '0');
        const ss = String(total % 60).padStart(2, '0');
        setDuration(`${mm}:${ss}`);

        // Count exercises
        const { count: exCount, error: exErr } = await supabase
          .from('workout_exercise')
          .select('*', { count: 'exact', head: true })
          .eq('workout_id', workout_id);
        if (exErr) throw exErr;
        setExerciseCount(exCount || 0);

        // Trigger confetti once data is loaded
        setShowConfetti(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [workout_id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4600DE" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti bursts from top-center */}
      {showConfetti && (
        <ConfettiCannon
          count={100}
          origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
          fadeOut
          fallSpeed={3000}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}

      <View style={styles.contentWrapper}>
        <MaterialIcons
          name="check-circle"
          size={72}
          color="#4600DE"
          style={styles.header}
        />
        <Text style={styles.title}>Workout Completed</Text>
        <Text style={styles.subtitle}>You crushed it!</Text>
        <Text style={styles.workoutName}>{workoutName}</Text>

        <View style={styles.statsRow}>
          {[
            { icon: 'access-time', value: duration, label: 'Duration' },
            {
              icon: 'fitness-center',
              value: exerciseCount.toString(),
              label: 'Exercises',
            },
            {
              icon: 'donut-large',
              value: `100%`,
              label: 'Completed',
            },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <MaterialIcons name={stat.icon} size={28} color="#4600DE" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footerText}>Keep the momentum going!</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            /* share logic */
          }}
        >
          <Text style={styles.primaryButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.outlineButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 24,
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { marginBottom: 16 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
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
  },
  buttonWrapper: {
    width: '90%',
    paddingBottom: spacingY._10,
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
