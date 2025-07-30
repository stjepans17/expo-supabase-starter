// import { View, Modal, StyleSheet, TouchableOpacity} from "react-native";
// import Typo from "./Typo";
// import { spacingX, spacingY } from "@/constants/spacings";

// type ModalProps = {
//   onPress?: () => void;
// }

// export const ChooseExerciseModal : React.FC<ModalProps> = ({ onPress }) => {
//   return(
//     <Modal
//       visible={true}
//       animationType="slide"
//       transparent={true}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalView}>
//           <View style={styles.modalTitleWrapper}>
//             <Typo style={styles.title}>Find an exercise by: </Typo>
//           </View>
//           <View style={styles.modalContentWrapper}>
//             <View style={styles.buttonWrapper}>
//               <TouchableOpacity style={styles.button}>
//                 <Typo style={styles.buttonText}>Name</Typo>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.buttonWrapper}>
//               <TouchableOpacity style={styles.button}>
//                 <Typo style={styles.buttonText}>Category</Typo>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.35)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalView: {
//     width: '80%',
//     height: '40%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     shadowColor: 'rgba(0, 0, 0, 0.1)',
//     shadowOpacity: 0.8,
//     elevation: 6,
//     shadowRadius: 15,
//     shadowOffset: { width: 1, height: 16 },
//   },
//   modalTitleWrapper: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center'
//   },
//   modalContentWrapper: {
//     flex: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: spacingX._10
//   },
//   title: {
//     fontFamily: 'Inter-Bold',
//     letterSpacing: -0.72,
//     color: '#4600DE'
//   },
//   button: {
//     height: '100%',
//     backgroundColor: '#4600DE',
//     width: '80%',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   buttonWrapper: {
//     flex: 1,
//     width: '100%',
//     height: '50%',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     letterSpacing: -0.72,
//     fontFamily: 'Inter-Bold'
//   }
// });

import { View, Modal, StyleSheet, TouchableOpacity} from "react-native";
import Typo from "./Typo";
import { spacingX, spacingY } from "@/constants/spacings";
import { router } from "expo-router";

type ModalProps = {
  onPress?: () => void;
}

export const ChooseExerciseModal : React.FC<ModalProps> = ({ onPress }) => {
  function onSearchByNamePress() {
    if(onPress) {
      onPress();
    }
    router.push("/search-by-name");
  }
  return(
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={onPress}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <View style={styles.modalTitleWrapper}>
            <Typo style={styles.title}>Find an exercise by:</Typo>
            <Typo style={styles.subtitle}>Choose your preferred search method</Typo>
          </View>
          
          <View style={styles.modalContentWrapper}>
            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onSearchByNamePress}>
              <View style={styles.buttonContent}>
                <Typo style={styles.buttonIcon}>🔍</Typo>
                <Typo style={styles.buttonText}>Search by Name</Typo>
                <Typo style={styles.buttonSubtext}>Type to find exercises</Typo>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} activeOpacity={0.8}>
              <View style={styles.buttonContent}>
                <Typo style={styles.buttonIcon}>📂</Typo>
                <Typo style={styles.buttonText}>Browse by Category</Typo>
                <Typo style={styles.buttonSubtext}>Explore muscle groups</Typo>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onPress}>
              <Typo style={styles.cancelText}>Cancel</Typo>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingX._20,
  },
  modalView: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    elevation: 10,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  modalTitleWrapper: {
    paddingTop: spacingY._30,
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalContentWrapper: {
    padding: spacingX._20,
    gap: spacingY._15,
  },
  modalFooter: {
    padding: spacingX._20,
    paddingTop: spacingY._10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
    color: '#4600DE',
    marginBottom: spacingY._5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F8F6FF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E3FF',
    padding: spacingX._20,
    minHeight: 80,
    justifyContent: 'center',
    // Add subtle shadow
    shadowColor: '#4600DE',
    shadowOpacity: 0.08,
    elevation: 2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonContent: {
    alignItems: 'center',
    gap: spacingY._5,
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: spacingY._5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.3,
    color: '#4600DE',
    textAlign: 'center',
  },
  buttonSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B7CC8',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: spacingY._15,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#999999',
  },
});