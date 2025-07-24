import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Typo from "./Typo";
import BlackClockSmallIcon from '@/assets/BlackClockSmallIcon.svg';
import { spacingX, spacingY } from "@/constants/spacings";

let { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface WorkoutCardProps {
  title: string;
  subtitle?: string;
  duration?: string;
  rightText?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  title, 
  subtitle, 
  duration, 
  rightText, 
  onPress,
  disabled = false 
}) => {

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  if (subtitle && duration && rightText) {
    return (
      <TouchableOpacity
        style={[
          styles.workoutCard,
          disabled && styles.workoutCardDisabled
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={styles.workoutCardTop}>
          <View style={styles.workoutInfo}>
            <Typo style={styles.titleText}>{title}</Typo>
            <Typo style={styles.subtitleText}>{subtitle}</Typo>
          </View>
        </View>
        <View style={styles.workoutCardBottom}>
          <View style={styles.workoutCardFooter}>
            <View style={styles.durationSection}>
              <View style={styles.durationContainer}>
                <BlackClockSmallIcon style={styles.clockIcon} />
                <Typo style={styles.titleText}>{duration}</Typo>
              </View>
            </View>
            <View style={styles.rightTextSection}>
              <Typo style={styles.percentageText}>{rightText}</Typo>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Return a basic card when some props are missing
  return (
    <TouchableOpacity
      style={[
        styles.workoutCard,
        disabled && styles.workoutCardDisabled
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.workoutCardTop}>
        <View style={{}}>
          <Typo style={styles.titleTextBig}>{title}</Typo>
          {
            subtitle && 
            <View style={{marginTop: spacingX._10}}>
              <Typo style={styles.titleText}>{subtitle}</Typo>
            </View>
          }
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutCard;

const styles = StyleSheet.create({
  // Text styles
  titleText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
  },
  titleTextBig: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
  },
  percentageText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#4600DE'
  },
  subtitleText: {
    letterSpacing: -0.72,
    fontSize: 16,
    color: '#9C9DA1',
    marginTop: spacingX._5
  },
  
  // Training section styles
  trainingSection: {
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionInner: {
    width: '90%',
    height: '90%',
    marginTop: -spacingX._5
  },
  sectionWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planSectionOffset: {
    marginTop: -spacingX._30
  },
  sectionHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: spacingY._20
  },
  headerIcon: {
    marginRight: spacingY._10
  },
  sectionContent: {
    flex: 3,
  },
  cardContainer: {
    marginLeft: spacingY._20,
    width: '90%',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  // Workout card styles
  workoutCard: {
    borderRadius: 16,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10.3,
    elevation: 5
  },
  workoutCardDisabled: {
    opacity: 0.5,
  },
  workoutCardTop: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  workoutInfo: {
    width: '90%',
    height: '60%'
  },
  workoutCardBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutCardFooter: {
    width: '90%',
    height: '60%',
    flexDirection: 'row'
  },
  durationSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  rightTextSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 8, // Changed from '5%' to a number
  },
  clockIcon: {
    marginTop: spacingX._3
  }
});