import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, SafeAreaView, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProgress } from '../src/contexts/ProgressContext';

const { width } = Dimensions.get('window');

const sampleExpressions = [
  { id: 'exp_001', english: "How's it going?", korean: "어떻게 지내세요?" },
  { id: 'exp_002', english: "Long time no see!", korean: "오랜만이에요!" },
  { id: 'exp_003', english: "Could you do me a favor?", korean: "부탁 하나만 들어주실 수 있나요?" },
  { id: 'exp_004', english: "That sounds like a great plan.", korean: "정말 좋은 계획이네요." },
];

export default function StudyScreen() {
  const router = useRouter();
  const { addXp, loseHeart, hearts } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));

  const currentExpression = sampleExpressions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / sampleExpressions.length) * 100;

  const playAudio = () => {
    Speech.speak(currentExpression.english, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleNext = (mastered: boolean) => {
    if (mastered) {
      addXp(10);
    } else {
      loseHeart();
      if (hearts <= 1) { // They are losing their last heart
        Alert.alert('Out of Hearts!', 'Take a break and try again later.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        return;
      }
    }

    if (isFlipped) {
      // Instantly reset flip for next card without animation delay
      flipAnim.setValue(0);
      setIsFlipped(false);
    }
    
    if (currentIndex < sampleExpressions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed lesson
      router.back();
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }], position: 'absolute' as 'absolute', top: 0, opacity: isFlipped ? 1 : 0 };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Progress Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color="#AFAFAF" />
          </TouchableOpacity>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            {/* Glossy reflection on progress bar for 3D feel */}
            <View style={styles.progressBarHighlight} />
          </View>
        </View>

        <View style={styles.cardContainer}>
          {/* Front of Card (English) */}
          <Animated.View style={[styles.card, frontAnimatedStyle, { opacity: isFlipped ? 0 : 1, zIndex: isFlipped ? 0 : 1 }]}>
            <TouchableOpacity style={styles.textContainer} onPress={flipCard} activeOpacity={0.8}>
              <Text style={styles.cardTextEnglish}>{currentExpression.english}</Text>
              <Text style={styles.hintText}>Tap to translate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.audioButton} onPress={playAudio} activeOpacity={0.7}>
              <Ionicons name="volume-high" size={32} color="#1CB0F6" />
            </TouchableOpacity>
          </Animated.View>

          {/* Back of Card (Korean) */}
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { zIndex: isFlipped ? 1 : 0 }]}>
            <TouchableOpacity style={styles.textContainer} onPress={flipCard} activeOpacity={0.8}>
              <Text style={styles.cardTextKorean}>{currentExpression.korean}</Text>
              <Text style={styles.hintTextWhite}>Tap to flip back</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Gamified 3D Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.actionBtn, styles.reviewBtn]} onPress={() => handleNext(false)} activeOpacity={0.7}>
            <Text style={[styles.actionBtnText, styles.reviewBtnText]}>Needs Review</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.masteredBtn]} onPress={() => handleNext(true)} activeOpacity={0.7}>
            <Text style={styles.actionBtnText}>Mastered</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  closeBtn: {
    marginRight: 15,
  },
  progressBarBg: {
    flex: 1,
    height: 18,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 10,
  },
  progressBarHighlight: {
    position: 'absolute',
    top: 3,
    left: 10,
    right: 10,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
  },
  cardContainer: {
    width: width * 0.85,
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 8, // Chunky depth
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    backgroundColor: '#1CB0F6',
    borderColor: '#1899D6',
  },
  textContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextEnglish: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3C3C3C',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardTextKorean: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  audioButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DDF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1CB0F6',
    borderBottomWidth: 4, // 3D button effect inside card
    marginTop: 20,
  },
  hintText: {
    position: 'absolute',
    bottom: 0,
    color: '#AFAFAF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  hintTextWhite: {
    position: 'absolute',
    bottom: 0,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 2,
    borderBottomWidth: 6, // Thick bottom border for tactile feel
  },
  reviewBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
  },
  reviewBtnText: {
    color: '#FF4B4B', // Red text on white button
  },
  masteredBtn: {
    backgroundColor: '#58CC02',
    borderColor: '#46A302',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
