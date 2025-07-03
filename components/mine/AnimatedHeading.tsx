import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

// TypeScript interface for props
interface AnimatedHeadingProps {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  letterSpacing?: number;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  fontFamily = 'Inter-Bold',
  fontSize = 28,
  color = '#4600DE',
  letterSpacing = -0.72
}) => {
  const textStyle = {
    fontFamily,
    fontSize,
    fontWeight: '800' as const,
    color,
    letterSpacing
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Animatable.Text
        animation="fadeInDown"
        duration={2000}
        style={textStyle}
      >
        Take control of
      </Animatable.Text>
      
      <Animatable.Text
        animation="fadeIn"
        duration={2500}
        delay={800}
        style={textStyle}
      >
        your workouts.
      </Animatable.Text>
    </View>
  );
};

export default AnimatedHeading;