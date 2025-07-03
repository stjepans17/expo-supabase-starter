import { radius } from '@/constants/spacings'
import { CustomButtonProps } from '@/types'
import { verticalScale } from '@/constants/styling'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

const Button = ({
    style,
    onPress,
    loading = false,
    children
}: CustomButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {children}
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#808080",
        borderRadius: radius._25,
        borderCurve: "continuous",
        height: verticalScale(52),
        justifyContent: "center",
        alignItems: "center"
    }
})