import { radius, spacingX, spacingY } from '@/constants/spacings'
import { InputProps } from '@/types'
import { verticalScale } from '@/constants/styling'
import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const Input = (props: InputProps) => {
    return (
        <View style={[styles.container, props.containerStyle && props.containerStyle]}>
            {
                props.icon && props.icon
            }
            <TextInput
                style={[
                    styles.input,
                    props.inputStyle
                ]}
                placeholderTextColor={"#a3a3a3"}
                ref={props.inputRef && props.inputRef}
                {...props}
            />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: verticalScale(60),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#d4d4d4',
        borderRadius: radius._15,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15,
        width: '100%',
        gap: spacingX._10,
        marginTop: spacingY._20
    },
    input: {
        flex: 1,
        color: 'black',
        fontSize: verticalScale(18),
        letterSpacing: -0.72
    }
})