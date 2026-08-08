import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStudyCard } from '../src/hooks/useStudyCard';
import FlashCard from '../src/components/FlashCard';
import { COLORS, RADIUS, SHADOW } from '../src/constants/theme';
import allExpressions from '../src/data/expressions.json';

export default function StudyScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();

  // Filter expressions by category (or use all)
  const expressions = categoryId
    ? allExpressions.filter(e => e.category === categoryId)
    : allExpressions;
  const list = expressions.length > 0 ? expressions : allExpressions;

  const {
    currentExpression,
    currentIndex,
    progressPercentage,
    isFlipped,
    isQuizMode,
    isFirst,
    isLast,
    frontAnimStyle,
    backAnimStyle,
    flipCard,
    toggleQuizMode,
    goNext,
    goPrev,
    goForward,
    playAudio,
  } = useStudyCard(list);

  const handleNext = (mastered: boolean) => {
    const result = goNext(mastered);
    if (result === 'done') router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>

        {/* ── Header: close + progress ──────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={COLORS.textMuted} />
          </TouchableOpacity>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` as any }]} />
          </View>
          <Text style={styles.progressText}>{currentIndex + 1}/{list.length}</Text>
        </View>

        {/* ── Quiz mode toggle ──────────────────── */}
        <TouchableOpacity
          style={[styles.quizToggle, isQuizMode && styles.quizToggleActive]}
          onPress={toggleQuizMode}
          activeOpacity={0.8}
        >
          <Ionicons
            name="bulb-outline"
            size={14}
            color={isQuizMode ? COLORS.purple : COLORS.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.quizToggleText, isQuizMode && styles.quizToggleTextActive]}>
            {isQuizMode ? 'Quiz ON · 한국어 먼저' : 'Quiz Mode · 한국어 먼저'}
          </Text>
        </TouchableOpacity>

        {/* ── Flashcard ─────────────────────────── */}
        <FlashCard
          frontText={isQuizMode ? currentExpression.korean : currentExpression.english}
          backText={isQuizMode ? currentExpression.english : currentExpression.korean}
          frontLabel={isQuizMode ? 'KO' : 'EN'}
          backLabel={isQuizMode ? 'EN' : 'KO'}
          isFlipped={isFlipped}
          showAudioOnFront={!isQuizMode}
          showAudioOnBack={isQuizMode}
          frontAnimStyle={frontAnimStyle}
          backAnimStyle={backAnimStyle}
          onFlip={flipCard}
          onAudio={playAudio}
        />

        {/* ── Navigation row ─────────────────────── */}
        <View style={styles.navRow}>
          {/* ← Prev */}
          <TouchableOpacity
            style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
            onPress={goPrev}
            activeOpacity={isFirst ? 1 : 0.7}
            disabled={isFirst}
          >
            <Ionicons name="chevron-back" size={20} color={isFirst ? '#2D2D44' : COLORS.indigo} />
          </TouchableOpacity>

          {/* Review / Mastered */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.reviewBtn} onPress={() => handleNext(false)} activeOpacity={0.7}>
              <Ionicons name="refresh-outline" size={16} color={COLORS.pink} style={{ marginRight: 4 }} />
              <Text style={styles.reviewBtnText}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.masteredBtn} onPress={() => handleNext(true)} activeOpacity={0.7}>
              <Ionicons name="checkmark" size={16} color={COLORS.white} style={{ marginRight: 4 }} />
              <Text style={styles.masteredBtnText}>Mastered</Text>
            </TouchableOpacity>
          </View>

          {/* → Next */}
          <TouchableOpacity
            style={[styles.navBtn, isLast && styles.navBtnDisabled]}
            onPress={goForward}
            activeOpacity={isLast ? 1 : 0.7}
            disabled={isLast}
          >
            <Ionicons name="chevron-forward" size={20} color={isLast ? '#2D2D44' : COLORS.indigo} />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgDeep },
  container: { flex: 1, paddingHorizontal: 20, alignItems: 'center', backgroundColor: COLORS.bgDeep },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    gap: 12,
  },
  closeBtn: { padding: 2 },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#1E1E30',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.violet,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'right',
  },

  /* Quiz toggle */
  quizToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    marginBottom: 20,
  },
  quizToggleActive: {
    borderColor: COLORS.violet,
    backgroundColor: '#1A1130',
  },
  quizToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  quizToggleTextActive: { color: COLORS.purple },

  /* Navigation row */
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnDisabled: {
    borderColor: '#1A1A28',
    backgroundColor: '#0D0D18',
  },

  /* Actions */
  actions: { flex: 1, flexDirection: 'row', gap: 8 },
  reviewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.pink + '55',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
  },
  reviewBtnText: { color: COLORS.pink, fontSize: 14, fontWeight: '600' },
  masteredBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.violet,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    ...Platform.select(SHADOW.button),
  },
  masteredBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
});
