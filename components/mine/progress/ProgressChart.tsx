import { Dimensions, StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Typo from '@/components/mine/Typo';
import { BarChart } from 'react-native-chart-kit';
import { spacingX, spacingY } from '@/constants/spacings';
import { ChartData } from 'react-native-chart-kit/dist/HelperTypes';

let { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProgressChartProps {
  chartData: ChartData;
  onIntervalChange: (interval: string) => void;
  interval: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ chartData, onIntervalChange, interval }) => {

  function getStyle(currInterval: string): TextStyle {
    return currInterval == interval ? styles.periodChooserTitleActive: styles.periodChooserTitle;
  }

  return (
    <View style={styles.barchartWrapper}>
      <View style={styles.barchartHeader}>
        <TouchableOpacity onPress={() => onIntervalChange?.("Week")}>
          <Typo style={getStyle("Week")}>Week</Typo>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onIntervalChange?.("Month")}>
          <Typo style={getStyle("Month")}>Month</Typo>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onIntervalChange?.("Year")}>
          <Typo style={getStyle("Year")}>Year</Typo>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onIntervalChange?.("All")}>
          <Typo style={getStyle("All")}>All</Typo>
        </TouchableOpacity>

      </View>
      <View style={styles.barchartContent}>
        <BarChart
          data={chartData}
          width={SCREEN_WIDTH * 0.9 * 0.95}
          height={SCREEN_HEIGHT * 0.4 * 0.8 * 0.9}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            barPercentage: 0.7,
          }} yAxisLabel={''} yAxisSuffix={''} />
      </View>
    </View>
  );
};

export default ProgressChart;

const styles = StyleSheet.create({
  barchartWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacingY._15
  },
  barchartHeader: {
    width: '90%',
    height: '15%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: spacingX._15,
    flexDirection: 'row'
  },
  barchartContent: {
    width: '90%',
    height: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  periodChooserTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#9C9C9C'
  },
  periodChooserTitleActive: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#BEA3F8'
  }
});