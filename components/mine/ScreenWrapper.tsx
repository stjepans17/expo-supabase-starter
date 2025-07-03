import React from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { ScreenWrapperProps } from "@/types";

let { height } = Dimensions.get('window');

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
    let paddingTop = Platform.OS == 'ios' ? height * 0.06 : 50;
    return (
        <View style={[
            {
                paddingTop,
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white"
            },
            style
        ]}>
            <StatusBar barStyle="light-content"/>
            {children}
        </View>
    )
}

export default ScreenWrapper

const styles = StyleSheet.create({})
