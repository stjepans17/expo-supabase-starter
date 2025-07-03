import { spacingX } from '@/constants/spacings';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BOX_MARGIN = 8;
const BOX_SIZE = (width * 0.9 - BOX_MARGIN * 6) / 2; // proper 2-per-row layout

type ExerciseBoxProps = {
  title: string;
  onPress: () => void;
};

const ExerciseBox: React.FC<ExerciseBoxProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BOX_SIZE,
    height: BOX_SIZE * 0.75,
    backgroundColor: '#4600DE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: spacingX._5,
    // marginTop: spacingX._5
  },
  text: {
    fontSize: width / 20,
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: -0.72,
  },
});

export default ExerciseBox;
