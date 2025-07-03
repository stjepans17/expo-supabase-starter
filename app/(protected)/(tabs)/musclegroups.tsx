import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenWrapper from '@/components/mine/ScreenWrapper';
import ExerciseBox from '@/components/mine/ExerciseBox';
import { spacingX, spacingY } from '@/constants/spacings';
import { fetchMusclesByMuscleGroupId } from '@/lib/muscle';
import { MuscleGroup } from '@/types';

const initialData: MuscleGroup[] = [
  {
    id: 1,
    name: 'Chest',
    description: '',
  },
  {
    id: 2,
    name: 'Back',
    description: '',
  },
  {
    id: 3,
    name: 'Arms',
    description: '',
  },
  {
    id: 4,
    name: 'Shoulders',
    description: '',
  },
  {
    id: 5,
    name: 'Legs',
    description: '',
  },
  {
    id: 6,
    name: 'Abs & Core',
    description: '',
  },
];

const MuscleGroups = () => {
  return (
    <ScreenWrapper>
      <View style={styles.wrapper}>
        <View style={styles.grid}>
          {initialData.map((item, index) => (
            <View
              key={index}
              style={{
                marginTop: spacingX._5,
                // marginLeft: index % 2 === 0 ? 0 : spacingX._5,
                // marginRight: index % 2 === 0 ? spacingX._5 : 0,
                marginLeft: spacingY._10,
                marginRight: spacingY._10
              }}
            >
              <ExerciseBox title={item.name} onPress={() => { }} />
            </View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    height: '98%',
    marginBottom: spacingX._15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export default MuscleGroups;