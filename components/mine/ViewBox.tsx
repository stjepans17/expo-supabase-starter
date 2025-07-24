import { Workout } from "@/types"
import { Dimensions, TouchableOpacity, View, StyleSheet } from "react-native"
import Typo from "./Typo"
import { spacingX } from "@/constants/spacings"

type ViewBoxProps = {
  workoutData: Workout,
  exerciseCount?: number,
  onPress?: () => void,
  disabled?: boolean,
}

const ViewBox: React.FC<ViewBoxProps> = ({ 
  workoutData, 
  exerciseCount, 
  onPress,
  disabled = false 
}) => {

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.viewBox,
        disabled && styles.viewBoxDisabled
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.viewBoxMain}>
        <View style={styles.viewBoxInner}>
          <Typo style={styles.infoTextTitle}>{workoutData.name}</Typo>
          <Typo style={styles.infoTextSubtitle}>{exerciseCount} exercises</Typo>
        </View>
      </View>
      <View style={styles.viewBoxBottom}>
        <View style={styles.viewBoxInner}>
          <Typo style={styles.infoText}>{workoutData.duration_min} min</Typo>
        </View>
      </View>
    </TouchableOpacity>
  )
};

export default ViewBox;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  header: {
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12.3,
    elevation: 5,
  },
  scrollArea: {
    height: '100%',
  },
  innerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '80%',
    flexDirection: 'row'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerWrapperLeftHalf: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerWrapperRightHalf: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
  },
  infoText: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    fontSize: 16
  },
  infoTextTitle: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    fontSize: 18,
    marginBottom: spacingX._5
  },
  infoTextSubtitle: {
    letterSpacing: -0.72,
    fontSize: 16,
    color: '#9C9DA1'
  },
  mainTitle: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    fontSize: 28
  },
  activeTab: {
    borderBottomColor: '#4600DE',
    borderBottomWidth: 2,
  },
  mainInnerWrapper: {
    width: '90%',
    height: '95%',
  },
  mainTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: spacingX._20
  },
  mainContentWrapper: {
    flex: 8
  },
  mainCategorySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingX._15,
    minHeight: Dimensions.get('window').height * 0.25,
  },
  mainCategoryTitleWrapper: {
    flex: 1,
    alignSelf: 'flex-start'
  },
  mainCategoryContentWrapper: {
    flex: 8,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row'
  },
  mainCategoryContentWrapperHorizontal: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  mainSubcontentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: Dimensions.get('window').width * 0.23
  },
  viewBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    height: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10.3,
    elevation: 5, // Android shadow
  },
  viewBoxDisabled: {
    opacity: 0.5,
  },
  viewBoxMain: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBoxBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBoxInner: {
    width: '80%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  viewBoxInnerRow: {
    width: '80%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row'
  }
})




// import { Workout } from "@/types"
// import { Dimensions, TouchableOpacity, View, StyleSheet } from "react-native"
// import Typo from "./Typo"
// import { spacingX } from "@/constants/spacings"

// type ViewBoxProps = {
//   workoutData: Workout,
//   exerciseCount?: number,
// }

// const ViewBox: React.FC<ViewBoxProps> = ({ workoutData, exerciseCount }) => {

//   return (
//     <TouchableOpacity style={styles.viewBox}>
//       <View style={styles.viewBoxMain}>
//         <View style={styles.viewBoxInner}>
//           <Typo style={styles.infoTextTitle}>{workoutData.name}</Typo>
//           <Typo style={styles.infoTextSubtitle}>{exerciseCount} exercises</Typo>
//         </View>
//       </View>
//       <View style={styles.viewBoxBottom}>
//         <View style={styles.viewBoxInner}>
//           <Typo style={styles.infoText}>{workoutData.duration_min} min</Typo>
//         </View>
//       </View>
//     </TouchableOpacity>
//   )
// };

// export default ViewBox;

// const styles = StyleSheet.create({
//   wrapper: {
//     width: '100%',
//     height: '100%',
//     flexDirection: 'column',
//   },
//   header: {
//     height: '10%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: -1,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 12.3,
//     elevation: 5,
//   },
//   scrollArea: {
//     height: '100%',
//   },
//   innerWrapper: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '80%',
//     height: '80%',
//     flexDirection: 'row'
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   innerWrapperLeftHalf: {
//     flex: 1,
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   innerWrapperRightHalf: {
//     flex: 1,
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   title: {
//     fontFamily: 'Inter-Bold',
//     letterSpacing: -0.72,
//   },
//   infoText: {
//     fontFamily: 'Inter-Bold',
//     letterSpacing: -0.72,
//     fontSize: 16
//   },
//   infoTextTitle: {
//     fontFamily: 'Inter-Bold',
//     letterSpacing: -0.72,
//     fontSize: 18,
//     marginBottom: spacingX._5
//   },
//   infoTextSubtitle: {
//     letterSpacing: -0.72,
//     fontSize: 16,
//     color: '#9C9DA1'
//   },
//   mainTitle: {
//     fontFamily: 'Inter-Bold',
//     letterSpacing: -0.72,
//     fontSize: 28
//   },
//   activeTab: {
//     borderBottomColor: '#4600DE',
//     borderBottomWidth: 2,
//   },
//   mainInnerWrapper: {
//     width: '90%',
//     height: '95%',
//   },
//   mainTitleWrapper: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//     marginBottom: spacingX._20
//   },
//   mainContentWrapper: {
//     flex: 8
//   },
//   mainCategorySection: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: spacingX._15,
//     minHeight: Dimensions.get('window').height * 0.25,
//   },
//   mainCategoryTitleWrapper: {
//     flex: 1,
//     alignSelf: 'flex-start'
//   },
//   mainCategoryContentWrapper: {
//     flex: 8,
//     width: '100%',
//     justifyContent: 'center',
//     alignContent: 'center',
//     flexDirection: 'row'
//   },
//   mainCategoryContentWrapperHorizontal: {
//     justifyContent: 'center',
//     alignContent: 'center',
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//   },
//   mainSubcontentWrapper: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//     minWidth: Dimensions.get('window').width * 0.23
//   },
//   viewBox: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     width: '90%',
//     height: '80%',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: -1,
//     },
//     shadowOpacity: 0.04,
//     shadowRadius: 10.3,
//     elevation: 5, // Android shadow
//   },
//   viewBoxMain: {
//     flex: 2,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   viewBoxBottom: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   viewBoxInner: {
//     width: '80%',
//     height: '90%',
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   viewBoxInnerRow: {
//     width: '80%',
//     height: '90%',
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//     flexDirection: 'row'
//   }
// })