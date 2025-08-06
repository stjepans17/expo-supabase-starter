import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

// helper to interpolate purple from very light (10% opacity) to full purple
function purpleWithAlpha() {
  const alpha = Math.min(Math.max(80 / 100, 0.1), 1);
  return `rgba(70,0,222,${alpha.toFixed(2)})`;
}

type ProgressCircleProps = {
  size: number           // width and height of the SVG
  strokeWidth: number    // thickness of the ring
  percent: number        // 0–100
}

export default function ProgressCircle({ size, strokeWidth, percent }: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - percent / 100)

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* background ring */}
        <Circle
          stroke="#eee"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* progress ring */}
        <Circle
          stroke={purpleWithAlpha()}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      {/* optional center label */}
      <View style={styles.labelContainer}>
        {/* <Text style={styles.label}>{`${Math.round(percent)}%`}</Text> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
})
