import React from 'react';
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet, Platform, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width - 36, 400);
const CARD_HEIGHT = 380;

interface Props {
  frontText: string;
  backText: string;
  frontLabel: string; // 'EN' | 'KO'
  backLabel: string;  // 'KO' | 'EN'
  isFlipped: boolean;
  showAudioOnFront: boolean;
  showAudioOnBack: boolean;
  frontAnimStyle: object;
  backAnimStyle: object;
  onFlip: () => void;
  onAudio: () => void;
}

export default function FlashCard({
  frontText,
  backText,
  frontLabel,
  backLabel,
  isFlipped,
  showAudioOnFront,
  showAudioOnBack,
  frontAnimStyle,
  backAnimStyle,
  onFlip,
  onAudio,
}: Props) {
  return (
    <View style={styles.container}>
      {/* ── Front Side ─────────────────────────── */}
      <Animated.View
        style={[
          styles.card,
          frontAnimStyle,
          { opacity: isFlipped ? 0 : 1, zIndex: isFlipped ? 0 : 1 },
        ]}
      >
        <TouchableOpacity style={styles.cardInner} onPress={onFlip} activeOpacity={0.9}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{frontLabel}</Text>
          </View>
          <Text style={styles.mainText}>{frontText}</Text>
          <View style={styles.hintRow}>
            <Ionicons name="swap-horizontal" size={14} color={COLORS.textDim} style={{ marginRight: 4 }} />
            <Text style={styles.hintText}>
              Tap to {frontLabel === 'EN' ? 'see Korean translation' : 'reveal English'}
            </Text>
          </View>
        </TouchableOpacity>

        {showAudioOnFront && (
          <TouchableOpacity
            style={styles.audioBtn}
            onPress={onAudio}
            activeOpacity={0.7}
            accessibilityLabel="Listen to pronunciation"
          >
            <Ionicons name="volume-high" size={20} color={COLORS.accentPurple} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* ── Back Side ──────────────────────────── */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          backAnimStyle,
          { zIndex: isFlipped ? 1 : 0 },
        ]}
      >
        <TouchableOpacity style={styles.cardInner} onPress={onFlip} activeOpacity={0.9}>
          <View style={[styles.badge, styles.badgeBack]}>
            <Text style={[styles.badgeText, { color: COLORS.accentPurple }]}>{backLabel}</Text>
          </View>
          <Text style={[styles.mainText, styles.backText]}>{backText}</Text>
          <View style={styles.hintRow}>
            <Ionicons name="swap-horizontal" size={14} color={COLORS.textDim} style={{ marginRight: 4 }} />
            <Text style={styles.hintText}>Tap to flip back</Text>
          </View>
        </TouchableOpacity>

        {showAudioOnBack && (
          <TouchableOpacity
            style={styles.audioBtn}
            onPress={onAudio}
            activeOpacity={0.7}
            accessibilityLabel="Listen to pronunciation"
          >
            <Ionicons name="volume-high" size={20} color={COLORS.accentPurple} />
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
    marginBottom: 24,
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
  cardInner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentIndigo + '20',
    borderWidth: 1,
    borderColor: COLORS.accentIndigo + '40',
    marginBottom: 20,
  },
  badgeBack: {
    backgroundColor: COLORS.accentPurple + '20',
    borderColor: COLORS.accentPurple + '40',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.accentIndigo,
  },
  mainText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  backText: {
    color: COLORS.accentLavender,
  },
  hintRow: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
    color: COLORS.textDim,
    fontWeight: '500',
  },
  audioBtn: {
    position: 'absolute',
    bottom: 16,
    right: 18,
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: '#1E1438',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
