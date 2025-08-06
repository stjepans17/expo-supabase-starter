import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { spacingX, spacingY } from "@/constants/spacings";
import * as Icons from 'phosphor-react-native';
import Typo from "../Typo";

let { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface PlanCardProps {
  title: string;
  subtitle?: string;
  weekInfo?: string;
  rightText?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  title, 
  subtitle, 
  weekInfo, 
  rightText, 
  onPress,
  disabled = false 
}) => {

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  if (subtitle && weekInfo && rightText) {
    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          disabled && styles.planCardDisabled
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={styles.planCardTop}>
          <View style={styles.planInfo}>
            <Typo style={styles.titleText}>{title}</Typo>
            <Typo style={styles.subtitleText}>{subtitle}</Typo>
          </View>
        </View>
        <View style={styles.planCardBottom}>
          <View style={styles.planCardFooter}>
            <View style={styles.weekSection}>
              <View style={styles.weekContainer}>
                <Typo style={styles.titleText}>{weekInfo}</Typo>
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
        styles.planCard,
        disabled && styles.planCardDisabled
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.planCardTop}>
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

export default PlanCard;

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
  
  // Plan card styles
  planCard: {
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
  planCardDisabled: {
    opacity: 0.5,
  },
  planCardTop: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  planInfo: {
    width: '90%',
    height: '60%'
  },
  planCardBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planCardFooter: {
    width: '90%',
    height: '60%',
    flexDirection: 'row'
  },
  weekSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  rightTextSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  weekContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  calendarIcon: {
    marginTop: spacingX._3
  }
});