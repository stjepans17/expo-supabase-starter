import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Typo from '../Typo';
import { spacingX, spacingY } from '@/constants/spacings';

let { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface WeightViewBoxProps {
  date: string;
  weight: string;
  onPress?: () => void;
}

const WeightViewBox: React.FC<WeightViewBoxProps> = ({ date, weight, onPress }) => {
  return (
    <View style={styles.contentBox}>
      <View style={styles.contentBoxHeader}>
        <Typo style={styles.achievementsHeaderText}>{date}</Typo>
      </View>
      <View style={styles.contentBoxMain}>
        <Typo style={styles.achievementsMainText}>{weight}</Typo>
      </View>
      <View style={styles.contentBoxFooter}>
      </View>
    </View>
  );
};

export default WeightViewBox;

const styles = StyleSheet.create({
  achievementsMainText: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    color: '#4600DE',
    marginLeft: spacingX._10
  },
  achievementsHeaderText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    color: '#000000',
    marginLeft: spacingX._10
  },
  contentBox: {
    width: SCREEN_HEIGHT * 0.2,
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10
  },
  contentBoxHeader: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  contentBoxFooter: {
    flex: 1.5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  contentBoxMain: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
});