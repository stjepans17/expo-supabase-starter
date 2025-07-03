import { Dimensions } from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const [shortDimension, longDimension] =
    SCREEN_WIDTH < SCREEN_HEIGHT ? [SCREEN_WIDTH, SCREEN_HEIGHT] : [SCREEN_HEIGHT, SCREEN_WIDTH];

const guidelineBaseWidth = 375; 
const guidelineBaseHeight = 812;

export const scale = (size: number) => {
    return Math.round((shortDimension / guidelineBaseWidth) * size as number);
};

export const verticalScale = (size: number) => {
    return Math.round((longDimension / guidelineBaseHeight) * size as number);
};