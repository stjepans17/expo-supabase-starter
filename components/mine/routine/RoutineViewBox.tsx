import { TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import Typo from "../Typo";
import { spacingX, spacingY } from "@/constants/spacings";
import { Ionicons } from '@expo/vector-icons'; 

interface RoutineViewBoxProps {
  routineName: string;
  exerciseCount: number;
  onStartRoutine?: () => void;
  onDeleteRoutine?: () => void;
}

let { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const iconSize = Math.max(20, SCREEN_WIDTH * 0.03);

const RoutineViewBox: React.FC<RoutineViewBoxProps> = ({
  routineName,
  exerciseCount,
  onStartRoutine,
  onDeleteRoutine
}) => {
  return (
    <View style={styles.routineViewBoxWrapper}>
      <View style={styles.routineViewBox}>
        <View style={styles.routineViewBoxHeader}>
          <View style={styles.routineNameRow}>
            <Typo style={{
              color: '#000000',
              letterSpacing: -0.72,
              fontSize: 20,
              fontFamily: 'Inter-Bold',
              marginTop: spacingY._5,
              flex: 1
            }}>
              {routineName.toUpperCase()}
            </Typo>
            <TouchableOpacity 
              onPress={onDeleteRoutine}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={iconSize} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          <Typo style={{
            color: '#8E8E93',
            letterSpacing: -0.72,
            fontSize: 16,
            fontFamily: 'Inter',
            marginTop: spacingY._5
          }}>
            {exerciseCount} Exercise{exerciseCount !== 1 ? 's' : ''}
          </Typo>
        </View>
        <View style={styles.routineViewBoxFooter}>
          <TouchableOpacity
            style={{
              backgroundColor: '#4600DE',
              borderRadius: 8,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={onStartRoutine}
          >
            <Typo style={{ color: '#FFFFFF', letterSpacing: -0.72 }}>
              Start Routine
            </Typo>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RoutineViewBox;

const styles = StyleSheet.create({
  routineViewBoxWrapper: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.7 * 0.25
  },
  routineViewBox: {
    margin: spacingX._10,
    backgroundColor: '#FFFFFF',
    flex: 1,
    borderRadius: 10
  },
  routineViewBoxHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: spacingX._10
  },
  routineViewBoxFooter: {
    flex: 1,
    margin: spacingX._10
  },
  routineNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  deleteButton: {
    padding: 4,
    marginTop: spacingY._5
  }
});
