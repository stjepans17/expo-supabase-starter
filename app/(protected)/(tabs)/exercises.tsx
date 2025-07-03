// import React, { useState } from 'react';
// import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import ScreenWrapper from '@/components/mine/ScreenWrapper';
// import ExerciseBox from '@/components/mine/ExerciseBox';
// import { spacingX, spacingY } from '@/constants/spacings';
// import { fetchMusclesByMuscleGroupId } from '@/lib/muscle';
// import { MuscleGroup, Muscle } from '@/types';
// import Typo from '@/components/mine/Typo';
// import { Router } from 'expo-router';

// const initialData: MuscleGroup[] = [
//   {
//     id: 1,
//     name: 'Chest',
//     description: '',
//   },
//   {
//     id: 2,
//     name: 'Back',
//     description: '',
//   },
//   {
//     id: 3,
//     name: 'Arms',
//     description: '',
//   },
//   {
//     id: 4,
//     name: 'Shoulders',
//     description: '',
//   },
//   {
//     id: 5,
//     name: 'Legs',
//     description: '',
//   },
//   {
//     id: 6,
//     name: 'Legs & Core',
//     description: '',
//   },
// ];

// const Exercises = () => {
//   const [currentView, setCurrentView] = useState<'muscleGroups' | 'muscles'>('muscleGroups');
//   const [muscles, setMuscles] = useState<Muscle[]>([]);
//   const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleMuscleGroupPress = async (muscleGroup: MuscleGroup) => {
//     setLoading(true);
//     setSelectedMuscleGroup(muscleGroup);

//     try {
//       const fetchedMuscles = await fetchMusclesByMuscleGroupId(muscleGroup.id);
//       setMuscles(fetchedMuscles);
//       setCurrentView('muscles');
//     } catch (error) {
//       console.error('Error fetching muscles:', error);
//       // Handle error appropriately - maybe show an error message
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToMuscleGroups = () => {
//     setCurrentView('muscleGroups');
//     setMuscles([]);
//     setSelectedMuscleGroup(null);
//   };

//   const handleMusclePress = (muscle: Muscle) => {
//     // Handle muscle selection - navigate to exercises or whatever you need
//     console.log('Selected muscle:', muscle);
//   };

//   const renderData = currentView === 'muscleGroups' ? initialData : muscles;

//   return (
//     <ScreenWrapper>
//       <View style={styles.wrapper}>
//         {/* You might want to add a back button here when showing muscles */}
//         {currentView === 'muscles' && (
//           <TouchableOpacity onPress={handleBackToMuscleGroups} style={styles.backButton}>
//             <Typo>← Back to Muscle Groups</Typo>
//           </TouchableOpacity>
//         )}

//         <View style={styles.grid}>
//           {renderData.map((item, index) => (
//             <View
//               key={item.id} 
//               style={{
//                 marginTop: spacingX._5,
//                 marginLeft: index % 2 === 0 ? 0 : spacingX._5,
//                 marginRight: index % 2 === 0 ? spacingX._5 : 0,
//               }}
//             >
//               <ExerciseBox 
//                 title={item.name} 
//                 onPress={() => {
//                   if (currentView === 'muscleGroups') {
//                     handleMuscleGroupPress(item as MuscleGroup);
//                   } else {
//                     handleMusclePress(item as Muscle);
//                   }
//                 }}
//               />
//             </View>
//           ))}
//         </View>

//         {loading && (
//           <View style={styles.loadingContainer}>
//             <Typo>Loading muscles...</Typo>
//           </View>
//         )}
//       </View>
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     width: '90%',
//     height: '98%',
//     marginBottom: spacingX._15,
//     alignItems: 'flex-start',
//     justifyContent: 'flex-start',
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     alignItems: 'flex-start',
//     justifyContent: 'flex-start',
//   },
//   backButton: {
//     padding: spacingX._3,
//     marginBottom: spacingX._5,
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{ translateX: -50 }, { translateY: -50 }],
//   },
// });

// export default Exercises;

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '@/components/mine/ScreenWrapper';
import ExerciseBox from '@/components/mine/ExerciseBox';
import { spacingX, spacingY } from '@/constants/spacings';
import { fetchMusclesByMuscleGroupId } from '@/lib/muscle';
import { MuscleGroup, Muscle } from '@/types';
import Typo from '@/components/mine/Typo';
import { Router } from 'expo-router';

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
    name: 'Legs & Core',
    description: '',
  },
];

const exercises = () => {
  const [loading, setLoading] = useState(false);

  const handleMusclePress = (muscle: Muscle) => {
    // Handle muscle selection - navigate to exercises or whatever you need
    console.log('Selected muscle:', muscle);
  };

  return (
    <ScreenWrapper>
      <View style={styles.wrapper}>
        <View style={styles.contentRow}>
          <View style={styles.contentColumn}>
            <ExerciseBox
              title='Abs & Core'
              onPress={() => console.log('click')}
            />
          </View>
          <View style={styles.contentColumn}>
            <ExerciseBox
              title='Arms'
              onPress={() => console.log('click')}
            />
          </View>
        </View>
        <View style={styles.contentRow}>
          <View style={styles.contentColumn}>
            <ExerciseBox
              title='Back'
              onPress={() => console.log('click')}
            />
          </View>
          <View style={styles.contentColumn}>
            <ExerciseBox
              title='Chest'
              onPress={() => console.log('click')}
            />
          </View>
        </View>
        <View style={styles.contentRow}></View>
        <View style={styles.contentRow}></View>
        <View style={styles.contentRow}></View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    height: '100%',
    marginBottom: spacingX._15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1
  },
  contentRow: {
    flex: 1,
    width: '100%',
    flexDirection: 'row'
  },
  contentColumn: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backButton: {
    padding: spacingX._3,
    marginBottom: spacingX._5,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});

export default exercises;