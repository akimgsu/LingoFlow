import React from 'react';
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet, Platform, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH  = width - 40;
const CARD_HEIGHT = 400;

interface Props {
  frontText: string;
  backText: string;
  frontLabel: string;    // 'EN' or 'KO'
  backLabel: string;
  isFlipped: boolean;
  showAudioOnFront: boolean;
  showAudioOnBack: boolean;
  frontAnimStyle: object;
  backAnimStyle: object;
  onFlip: () => void;
  onAudio: () => void;
}

export default function FlashCard({
  frontText, backText,
  frontLabel, backLabel,
  isFlipped,
  showAudioOnFront, showAudioOnBack,
  frontAnimStyle, backAnimStyle,
  onFlip, onAudio,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Front */}
      <Animated.View
        style={[styles.card, frontAnimStyle, { opacity: isFlipped ? 0 : 1, zIndex: isFlipped ? 0 : 1 }]}
      >
        <TouchableOpacity style={styles.inner} onPress={onFlip} activeOpacity={0.9}>
          <Text style={styles.label}>{frontLabel}</Text>
          <Text style={styles.mainText}>{frontText}</Text>
          <Text style={styles.hint}>Tap to {frontLabel === 'EN' ? 'translate' : 'reveal answer'}</Text>
        </TouchableOpacity>
        {showAudioOnFront && (
          <TouchableOpacity style={styles.audioBtn} onPress={onAudio} activeOpacity={0.7}>
            <Ionicons name="volume-high-outline" size={22} color={COLORS.indigo} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Back */}
      <Animated.View
        style={[styles.card, styles.cardBack, backAnimStyle, { zIndex: isFlipped ? 1 : 0 }]}
      >
        <TouchableOpacity style={styles.inner} onPress={onFlip} activeOpacity={0.9}>
          <Text style={[styles.label, { color: COLORS.purple }]}>{backLabel}</Text>
          <Text style={styles.backText}>{backText}</Text>
          <Text style={[styles.hint, { color: COLORS.textMuted }]}>Tap to flip back</Text>
        </TouchableOpacity>
        {showAudioOnBack && (
          <TouchableOpacity style={styles.audioBtn} onPress={onAudio} activeOpacity={0.7}>
            <Ionicons name="volume-high-outline" size={22} color={COLORS.indigo} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select(SHADOW.card),
  },
  cardBack: {
    backgroundColor: COLORS.bgCardBack,
    borderColor: COLORS.borderAccent,
  },
  inner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.indigo,
    marginBottom: 20,
  },
  mainText: {
    fontSize: 26,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  backText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#C4B5FD',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  hint: {
    position: 'absolute',
    bottom: 20,
    fontSize: 13,
    color: COLORS.textDim,
    fontWeight: '500',
  },
  audioBtn: {
    position: 'absolute',
    bottom: 18,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1130',
    borderWidth: 1,
    borderColor: '#4C1D95',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
