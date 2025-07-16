import React from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { ScreenWrapperProps } from "@/types";

let { height } = Dimensions.get('window');

const ScreenWrapperMinMargin = ({ style, children }: ScreenWrapperProps) => {
    let paddingTop = 0;
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

export default ScreenWrapperMinMargin;