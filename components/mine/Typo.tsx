import { TypoProps } from '@/types'
import { verticalScale } from '@/constants/styling'
import React from 'react'
import { Text, TextStyle } from 'react-native'

const Typo = ({
    size,
    color = "#000000", // should be imported from colors.text
    fontWeight = "400",
    fontFamily = "Inter-Regular",
    children,
    style,
    textProps = {},
}: TypoProps) => {
    const textStyle: TextStyle = {
        fontSize: size ? verticalScale(size) : verticalScale(18),
        color,
        fontWeight,
        fontFamily
    }
    return (
        <Text style={[textStyle, style]} {...textProps}>{children}</Text>
    )
}

export default Typo
