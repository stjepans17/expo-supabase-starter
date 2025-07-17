import React from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { ScreenWrapperProps } from "@/types";

let { height } = Dimensions.get('window');

const ScreenWrapperMidMargin = ({ style, children }: ScreenWrapperProps) => {
    let paddingTop = Platform.OS == 'ios' ? height * 0.03 : 25;
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
        ]} collapsable={false}>
            <StatusBar barStyle="light-content"/>
            {children}
        </View>
    )
}

export default ScreenWrapperMidMargin;