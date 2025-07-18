// import { ScrollView, StyleSheet, Text, View } from 'react-native'
// import React, { useState } from 'react'
// import ScreenWrapper from '@/components/mine/ScreenWrapper'
// import { spacingX } from '@/constants/spacings'
// import Typo from '@/components/mine/Typo'
// import ScreenWrapperMinMargin from '@/components/mine/ScreenWrapperMinMargin'

// const workouts = () => {

//   const [view, setView] = useState<string>("Workouts");

//   return (
//     <ScreenWrapperMinMargin style={{backgroundColor: '#F2F2F0', justifyContent: 'flex-start', alignItems: 'stretch' }}>
//       <View style={styles.wrapper}>
//         <View style={styles.header}>

//         </View>
//         <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

//         </ScrollView>
//       </View>
//     </ScreenWrapperMinMargin>
//   )
// }

// export default workouts

// const styles = StyleSheet.create({
//   wrapper: {
//     width: '100%',
//     // marginBottom: spacingX._15,
//     // alignItems: 'flex-start',
//     // justifyContent: 'flex-start',
//     flex: 1,
//     flexDirection: 'column',
//   },
//   header: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     // boxShadow: '0px -1px 12.3px 0px rgba(0, 0, 0, 0.25);'
//   },
//   scrollArea: {
//     flex: 5,
//     backgroundColor: 'green'
//   },
//   innerWrapper: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '90%',
//     height: '90%',
//   },
//   scrollContent: {
//     flexGrow: 1,           // keep it from collapsing if empty
//     padding: 16,
//   },
// })

import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@/components/mine/ScreenWrapper'
import { spacingX } from '@/constants/spacings'
import Typo from '@/components/mine/Typo'
import ScreenWrapperMinMargin from '@/components/mine/ScreenWrapperMinMargin'

const { height: screenHeight } = Dimensions.get('window');

const workouts = () => {

  const [view, setView] = useState<string>("Workouts");

  return (
    <ScreenWrapperMinMargin style={{ backgroundColor: '#F2F2F0', justifyContent: 'flex-start', alignItems: 'stretch' }}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.innerWrapper}>
            <View style={[styles.innerWrapperLeftHalf]}>
              <View style={[{ width: '80%', height: '80%', justifyContent: 'center', alignItems: 'center' }, view === "Workouts" && styles.activeTab]}>
                <TouchableOpacity onPress={() => setView("Workouts")}>
                  <Typo style={styles.title}>Workouts</Typo>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.innerWrapperRightHalf]}>
              <View style={[{ width: '80%', height: '80%', justifyContent: 'center', alignItems: 'center' }, view === "Plans" && styles.activeTab]}>
                <TouchableOpacity onPress={() => setView("Plans")}>
                  <Typo style={styles.title}>Plans</Typo>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mainInnerWrapper}>
            <View style={styles.mainTitleWrapper}>
              <Typo style={styles.mainTitle}>Your {view}</Typo>
            </View>
            <View style={styles.mainContentWrapper}>
              <View style={styles.mainCategorySection}>
                <View style={styles.mainCategoryTitleWrapper}>
                  <Typo style={styles.title}>Favorites</Typo>
                </View>
                <ScrollView contentContainerStyle={styles.mainCategoryContentWrapper} horizontal={true}>
                  <View style={styles.mainSubcontentWrapper}>
                    <View style={styles.viewBox}>

                    </View>
                  </View>
                  <View style={styles.mainSubcontentWrapper}>
                    <View style={styles.viewBox}>

                    </View>
                  </View>
                </ScrollView>
              </View>
              <View style={styles.mainCategorySection}>
                <View style={styles.mainCategoryTitleWrapper}>
                  <Typo style={styles.title}>Specific Category #1</Typo>
                </View>
                <View style={styles.mainCategoryContentWrapper}>
                  <View style={styles.mainSubcontentWrapper}>
                    {/* todo: convert viewBox to component */}
                    <TouchableOpacity style={styles.viewBox}>
                      <View style={styles.viewBoxMain}>
                        <View style={styles.viewBoxInner}>
                          <Typo style={styles.infoTextTitle}>Push Workout</Typo>
                          <Typo style={styles.infoTextSubtitle}>5 exercises</Typo>
                        </View>
                      </View>
                      <View style={styles.viewBoxBottom}>
                        <View style={styles.viewBoxInner}>
                          <Typo style={styles.infoText}>60 min</Typo>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.mainSubcontentWrapper}>
                    <View style={styles.viewBox}>

                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.mainCategorySection}>
                <View style={styles.mainCategoryTitleWrapper}>
                  <Typo style={styles.title}>Specific Category #2</Typo>
                </View>
                <View style={styles.mainCategoryContentWrapper}>
                  <View style={styles.mainSubcontentWrapper}>
                    <View style={styles.viewBox}>

                    </View>
                  </View>
                  <View style={styles.mainSubcontentWrapper}>
                    <View style={styles.viewBox}>

                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapperMinMargin>
  )
}

export default workouts

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  header: {
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12.3,
    elevation: 5,
  },
  scrollArea: {
    height: '100%',
  },
  innerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '80%',
    flexDirection: 'row'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerWrapperLeftHalf: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerWrapperRightHalf: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
  },
  infoText: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    fontSize: 16
  },
  infoTextTitle: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    fontSize: 18,
    marginBottom: spacingX._5
  },
  infoTextSubtitle: {
    letterSpacing: -0.72,
    fontSize: 16,
    color: '#9C9DA1'
  },
  mainTitle: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    fontSize: 28
  },
  activeTab: {
    borderBottomColor: '#4600DE',
    borderBottomWidth: 2,
  },
  mainInnerWrapper: {
    width: '90%',
    height: '95%',
  },
  mainTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: spacingX._20
  },
  mainContentWrapper: {
    flex: 8
  },
  mainCategorySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingX._15,
    minHeight: Dimensions.get('window').height * 0.25,
  },
  mainCategoryTitleWrapper: {
    flex: 1,
    alignSelf: 'flex-start'
  },
  mainCategoryContentWrapper: {
    flex: 8,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row'
  },
  mainCategoryContentWrapperHorizontal: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  mainSubcontentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: Dimensions.get('window').width * 0.23
  },
  viewBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    height: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10.3,
    elevation: 5, // Android shadow
  },
  viewBoxMain: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBoxBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBoxInner: {
    width: '80%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  viewBoxInnerRow: {
    width: '80%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row'
  }
})